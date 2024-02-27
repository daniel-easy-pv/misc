import * as THREE from 'three'
import { ScreenPosition } from '../ScreenPosition'
import { getMeshByUserDataValue } from '../utils'
import { MOUSE_ACCURACY_THRESHOLD } from '../consts'

// pipes must snap to a grid with this resolution in mm
const GRID_SNAP_DELTA = 500
const GRID_DIM = 40
const GRID_DOT_SIZE = '3px'

// a coordinate system from the anchor
const AXIS_COLORS = [
    'red',
    'green',
    'blue',
]
const UNITS = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 1),
]

export function addPipeListener(domElement, threeElements) {
    const {
        scene,
        camera,
        // pointer,
        // raycaster,
    } = threeElements
    
    const pipeGroup = initPipeGroup(scene)
    
    let anchor
    let tempMesh
    const euler = new THREE.Euler(0, 0, Math.PI / 4, 'ZYX')

    addStationaryClickListener(domElement)

    domElement.addEventListener('stationaryClick', function buildPipe(evt) {
        const domElementOffset = new THREE.Vector2(domElement.offsetLeft, domElement.offsetTop)
        const mousePos = new THREE.Vector2(evt.detail.endX, evt.detail.endY).addScaledVector(domElementOffset, -1)
        
        // first click
        if (!anchor) {
            const pipeEntries = getMeshByUserDataValue(scene, 'isPipeEntry', true)
            const screenPosition = new ScreenPosition(domElement, camera)
            const potentialSnapPositions = pipeEntries
                .map(entry => {
                    const target = entry.getWorldPosition(new THREE.Vector3())
                    return screenPosition.toPixels(target)
                })
            const { closestIndex, closestDistance } = getClosest(potentialSnapPositions, mousePos)
    
            // terminate if none selected
            if (closestDistance > MOUSE_ACCURACY_THRESHOLD) return
            const closestPipeEntry = pipeEntries[closestIndex]
            if (closestPipeEntry) {
                anchor = closestPipeEntry.getWorldPosition(new THREE.Vector3())
            }
        } else {
            const secondClick = closestOnGrid(domElement, anchor, euler, camera, mousePos)
            destroyHelpers(domElement)
            const path = new PipeCurve([anchor, secondClick])
            const geometry = new THREE.TubeGeometry(path, 20, 50, 8, false)
            const material = PipeCurve.Material
            const mesh = new THREE.Mesh(geometry, material)
            pipeGroup.remove(tempMesh)
            pipeGroup.add(mesh)
            anchor = null

            // add imaginary valve for future pipe connections
            const imaginaryValve = new THREE.Group()
            imaginaryValve.userData.isPipeEntry = true
            imaginaryValve.position.copy(secondClick)
            pipeGroup.add(imaginaryValve)
        }
    })
    
    // Displays the next mesh that will be added, following the mouse
    domElement.addEventListener('mousemove', function(evt) {
        if (!anchor) return
        const domElementOffset = new THREE.Vector2(domElement.offsetLeft, domElement.offsetTop)
        const mousePos = new THREE.Vector2(evt.clientX, evt.clientY).addScaledVector(domElementOffset, -1)
        destroyHelpers(domElement)
        const coordHelperGroup = document.createElement('div')
        coordHelperGroup.classList.add('coord-helpers')
        const axes = getHTMLAxes(domElement, anchor, euler, camera, mousePos)
        coordHelperGroup.appendChild(axes)
        const { 
            closestCandidateIndex, 
            circles, 
            candidates } = closestOnGridDetailed(domElement, anchor, euler, camera, mousePos)
        const circleGroup = drawCircles(domElement, circles, closestCandidateIndex)
        coordHelperGroup.appendChild(circleGroup)
        domElement.appendChild(coordHelperGroup)
        
        const candidate = candidates[closestCandidateIndex]
        const path = new PipeCurve([anchor, candidate])
        const geometry = new THREE.TubeGeometry(path, 20, 50, 8, false)
        const material = PipeCurve.Material
        const mesh = new THREE.Mesh(geometry, material)
        pipeGroup.remove(tempMesh)
        pipeGroup.add(mesh)
        tempMesh = mesh
    })

    const tempFuschia = new THREE.Group()
    scene.add(tempFuschia)
    domElement.addEventListener('updateFuschia', function() {
        const sphereGroup = candidatesOnWalls(scene, anchor, euler)
        tempFuschia.clear()
        tempFuschia.add(sphereGroup)
    })

    domElement.addEventListener('keydown', function(evt) {
        if (evt.key === 'r') {
            euler.z += Math.PI / 8
        }
        domElement.dispatchEvent(new CustomEvent('updateFuschia'))
    })
    
}

function getClosest(arrs, vector) {
    let closestIndex = -1
    let closestDistance = Infinity
    for (let i = 0; i < arrs.length; i++) {
        const arr = arrs[i]
        const d = arr.distanceTo(vector)
        if (d < closestDistance) {
            closestIndex = i
            closestDistance = d
        }
    }
    return {
        closestIndex,
        closestDistance,
    }
}

function addStationaryClickListener(domElement) {
    let startX, startY

    domElement.addEventListener('mousedown', function(event) {
        startX = event.clientX
        startY = event.clientY
    })

    domElement.addEventListener('mouseup', function(event) {
        const endX = event.clientX
        const endY = event.clientY

        // Calculate the distance between mousedown and mouseup positions
        const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))

        // Check if the distance is within 10 pixels
        if (distance <= 10) {
            // Fire a custom event
            const customEvent = new CustomEvent('stationaryClick', {
                detail: {
                    startX,
                    startY,
                    endX,
                    endY,
                }
            })
            domElement.dispatchEvent(customEvent)
        }
    })
}




/**
 * 
 * @param {HTMLElement} domElement 
 * @param {THREE.Vector3} anchor 
 * @param {THREE.Camera} camera 
 * @param {THREE.Vector2} mousePos 
 * @returns {THREE.Vector3}
 */
function closestOnGrid(domElement, anchor, euler, camera, mousePos) {
    const details = closestOnGridDetailed(domElement, anchor, euler, camera, mousePos)
    const { candidates, closestCandidateIndex } = details
    return candidates[closestCandidateIndex]
}

function closestOnGridDetailed(domElement, anchor, euler, camera, mousePos) {
    const candidates = candidatesOnGrid(domElement, anchor, euler)
    const circles = projectedCandidates(domElement, anchor, camera, candidates)
    const closestCandidateIndex = argmin(
        Array.from({ length: candidates.length }, (_, i) => i), 
        i => mousePos.distanceToSquared(circles[i]))
    return {
        candidates,
        circles,
        closestCandidateIndex,
    }
}

function projectedCandidates(domElement, _anchor, camera, candidates) {
    const screenPosition = new ScreenPosition(domElement, camera)
    // project candidates to 2D
    return candidates.map(v => screenPosition.toPixels(v))
}

/**
 * Returns the coordinate frame after rotating the standard frame by an Euler angle.
 * 
 * @param {THREE.Euler} euler
 */
function getCoordinateFrame(euler) {
    return UNITS.map(v => v.clone().applyEuler(euler))
}

function candidatesOnGrid(_domElement, anchor, euler) {
    const candidates = getCoordinateFrame(euler).flatMap(axis => {
        const seq = Array.from({ length: 2 * GRID_DIM + 1 }, (_, i) => (i - GRID_DIM) * GRID_SNAP_DELTA)
        return seq.map(l => axis.clone().multiplyScalar(l).add(anchor))
    })
    return candidates
}
function candidatesToSnap(scene, anchor, euler) {
    const pointsToSnap = []
    const NEAR = 100
    const FAR = 100000 // 100 m
    for (const direction of getCoordinateFrame(euler)) {
        const raycaster = new THREE.Raycaster(anchor, direction, NEAR, FAR)
        const intersectObject = raycaster.intersectObject(scene, true)
        for (const intersection of intersectObject) {
            pointsToSnap.push(intersection.point)
        }
    }
    return pointsToSnap
}

function candidatesOnWalls(scene, anchor, euler) {
    const pointsToSnap = candidatesToSnap(scene, anchor, euler)
    const sphereGroup = new THREE.Group()
    for (const point of pointsToSnap) {
        const geometry = new THREE.SphereGeometry(50)
        const material = new THREE.MeshBasicMaterial({ color: 0xff00ff })
        const sphere = new THREE.Mesh(geometry, material)
        sphere.position.copy(point)
        sphereGroup.add(sphere)
    }
    return sphereGroup
}

function drawCircles(domElement, circles, closestCandidateIndex) {
    const circleGroup = document.createElement('div')
    for (let i = 0; i < circles.length; i++) {
        const c = circles[i]
        const circle = addCircle(c.x, c.y, i === closestCandidateIndex ? 'red' : 'black')
        circleGroup.appendChild(circle)
    }
    return circleGroup
}

/**
 * Returns the axes for debugging purposes.
 * 
 * @param {string} domElement 
 * @param {THREE.Vector3} anchor 
 * @param {THREE.Euler} euler 
 * @param {THREE.Camera} camera 
 * @param {THREE.Vector2} mousePos 
 * @returns {HTMLDivElement}
 */
function getHTMLAxes(domElement, anchor, euler, camera, mousePos) {
    const UNIT = 1000 // distance from anchor to another point on each of the 3 axes, must be large enough for accuracy
    const axes = getCoordinateFrame(euler).map(axis => anchor.clone().addScaledVector(axis, UNIT))
    const screenPosition = new ScreenPosition(domElement, camera)
    // project axes to 2D
    const po = screenPosition.toPixels(anchor)
    const pm = mousePos.clone().addScaledVector(po, -1)
    const deltas = axes.map(v => screenPosition.toPixels(v))
        .map(v => v.clone().addScaledVector(po, -1).normalize())
    const qs = deltas.map(v => v.clone().multiplyScalar(v.dot(pm)))
    const projections = qs.map(v => v.clone().add(po))
    // draw on screen for debugging
    const rayGroup = document.createElement('div')
    for (let i = 0; i < projections.length; i++) {
        const p = projections[i]
        const ray = buildRay(po.x, po.y, p.x, p.y, AXIS_COLORS[i])
        rayGroup.appendChild(ray)
    }
    return rayGroup
}

function destroyHelpers(domElement = document) {
    const coordHelperGroup = domElement.querySelector('.coord-helpers')
    coordHelperGroup?.parentNode.removeChild(coordHelperGroup)
}

function argmin(arr, func) {
    if (arr.length === 0) {
        throw new Error('Array must not be empty')
    }
    let minIndex = 0
    let minValue = func(arr[0])
  
    for (let i = 1; i < arr.length; i++) {
        const currentValue = func(arr[i])
        if (currentValue < minValue) {
            minValue = currentValue
            minIndex = i
        }
    }
    return minIndex
}

function addCircle(left, top, color = 'black') {
    // Create a new div element
    const circle = document.createElement('div')
  
    circle.style.width = GRID_DOT_SIZE
    circle.style.height = GRID_DOT_SIZE
    circle.style.borderRadius = '50%'
    circle.style.background = color
  
    // Set the position using top and left properties
    circle.style.position = 'absolute'
    const navOffset = document.querySelector('nav')?.offsetHeight ?? 0
    circle.style.top = `${top - navOffset}px`
    circle.style.position = 'absolute'
    circle.style.left = left + 'px'
    circle.style.transform = 'translate(-50%,-50%)'
    return circle
}

function buildRay(startX, startY, endX, endY, color = 'black') {
    // Create a new div element for the ray
    const ray = document.createElement('div')
  
    // Calculate the length and angle of the ray
    const length = 1000
    const angle = Math.atan2(endY - startY, endX - startX)
  
    // Apply styles to make it a line (ray)
    ray.style.width = length + 'px'
    ray.style.height = '1px' // Adjust the thickness as needed
    ray.style.background = color
    ray.style.position = 'absolute'
    const navOffset = document.querySelector('nav')?.offsetHeight ?? 0
    ray.style.top = `${startY - navOffset}px`
    ray.style.left = startX + 'px'
    ray.style.transformOrigin = '0% 50%'
    ray.style.transform = 'rotate(' + angle + 'rad)'
    return ray
}

class PipeCurve extends THREE.Curve {
    constructor(arr) {
        super()
        this.arr = arr
    }

    static Material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        color: 0x0000ff,
    })

    getPoint(t, optionalTarget = new THREE.Vector3()) {
        const p0 = this.arr[0]
        const p1 = this.arr[1]
        const tx = (1-t) * p0.x + t * p1.x
        const ty = (1-t) * p0.y + t * p1.y
        const tz = (1-t) * p0.z + t * p1.z
        return optionalTarget.set(tx, ty, tz)
    } 
}

function initPipeGroup(scene) {
    const existingPipeGroup = getMeshByUserDataValue(scene, 'isPipeGroup', true)
    if (existingPipeGroup.length) {
        return existingPipeGroup[0]
    } else {
        const pipeGroup = new THREE.Group()
        pipeGroup.userData.isPipeGroup = true
        scene.add(pipeGroup)
        return pipeGroup
    }
}