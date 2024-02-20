import * as THREE from 'three'
import { ScreenPosition } from '../ScreenPosition'
import { getMeshByUserDataValue } from '../utils'
import { MOUSE_ACCURACY_THRESHOLD } from '../consts'
export function addPipeListener(domElement, threeElements) {
    const {
        scene,
        camera,
        pointer,
        raycaster,
    } = threeElements
    let anchor
    let tempMesh

    addStationaryClickListener(domElement)

    domElement.addEventListener('stationaryClick', function buildPipe(evt) {
        const domElementOffset = new THREE.Vector2(domElement.offsetLeft, domElement.offsetTop)
        const mousePos = new THREE.Vector2(evt.detail.endX, evt.detail.endY).addScaledVector(domElementOffset, -1)
        
        // first click
        if (!anchor) {
            const radiators = getMeshByUserDataValue(scene, 'slateClass', 'Radiator')
            const potentialSnapPositions = radiators
                .map(radiator => new ScreenPosition(domElement, camera).toPixels(radiator.position))
            const { closestIndex, closestDistance } = getClosest(potentialSnapPositions, mousePos)
    
            // terminate if none selected
            if (closestDistance > MOUSE_ACCURACY_THRESHOLD) return
            const closestRadiator = radiators[closestIndex]
            if (closestRadiator) {
                anchor = closestRadiator.position
            }
        } else {
            const secondClick = closestOnGrid(domElement, anchor, camera, mousePos)
            destroyHelpers(domElement)
            const path = new Pipe([anchor, secondClick])
            const geometry = new THREE.TubeGeometry(path, 20, 50, 8, false)
            const material = Pipe.Material
            const mesh = new THREE.Mesh(geometry, material)
            scene.remove(tempMesh)
            scene.add(mesh)
            anchor = null
        }
    })
    
    domElement.addEventListener('mousemove', function() {
        if (!anchor) return
        raycaster.setFromCamera(pointer, camera)
        const intersects = raycaster.intersectObjects(scene.children)
        if (intersects.length > 0) {
            const intersectionPoint = intersects[0].point
            const path = new Pipe([anchor, intersectionPoint])
            const geometry = new THREE.TubeGeometry(path, 20, 50, 8, false)
            const material = Pipe.Material
            const mesh = new THREE.Mesh(geometry, material)
            scene.remove(tempMesh)
            scene.add(mesh)
            tempMesh = mesh
        }
    })

    domElement.addEventListener('mousemove', function(evt) {
        if (!anchor) return
        const domElementOffset = new THREE.Vector2(domElement.offsetLeft, domElement.offsetTop)
        const mousePos = new THREE.Vector2(evt.clientX, evt.clientY).addScaledVector(domElementOffset, -1)
        destroyHelpers(domElement)
        drawAxes(domElement, anchor, camera, mousePos)
        const { closestCandidateIndex, circles } = closestOnGridDetailed(domElement, anchor, camera, mousePos)
        drawCircles(domElement, circles, closestCandidateIndex)
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

// distance from anchor to another point on each of the 3 axes, must be large enough for accuracy
const UNIT = 1000 

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

// pipes must snap to a grid with this resolution in mm
const GRID_SNAP_DELTA = 500
const GRID_DIM = 10
/**
 * 
 * @param {HTMLElement} domElement 
 * @param {THREE.Vector3} anchor 
 * @param {THREE.Camera} camera 
 * @param {THREE.Vector2} mousePos 
 */
function closestOnGrid(domElement, anchor, camera, mousePos) {
    const details = closestOnGridDetailed(domElement, anchor, camera, mousePos)
    const { candidates, closestCandidateIndex } = details
    return candidates[closestCandidateIndex]
}

function closestOnGridDetailed(domElement, anchor, camera, mousePos) {
    const candidates = candidatesOnGrid(domElement, anchor)
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

function candidatesOnGrid(_domElement, anchor) {
    const candidates = UNITS.flatMap(axis => {
        const seq = Array.from({ length: 2 * GRID_DIM + 1 }, (_, i) => (i - GRID_DIM) * GRID_SNAP_DELTA)
        return seq.map(l => axis.clone().multiplyScalar(l).add(anchor))
    })
    return candidates
}

function drawCircles(domElement, circles, closestCandidateIndex) {
    for (let i = 0; i < circles.length; i++) {
        const c = circles[i]
        const circle = addCircle(c.x, c.y, i === closestCandidateIndex ? 'red' : 'black')
        domElement.appendChild(circle)
    }
}

function drawAxes(domElement, anchor, camera, mousePos) {
    const axes = UNITS.map(axis => anchor.clone().addScaledVector(axis, UNIT))
    const screenPosition = new ScreenPosition(domElement, camera)
    // project axes to 2D
    const po = screenPosition.toPixels(anchor)
    const pm = mousePos.clone().addScaledVector(po, -1)
    const deltas = axes.map(v => screenPosition.toPixels(v))
        .map(v => v.clone().addScaledVector(po, -1).normalize())
    const qs = deltas.map(v => v.clone().multiplyScalar(v.dot(pm)))
    const projections = qs.map(v => v.clone().add(po))
    // draw on screen for debugging
    for (let i = 0; i < projections.length; i++) {
        const p = projections[i]
        const ray = buildRay(po.x, po.y, p.x, p.y, AXIS_COLORS[i])
        domElement.appendChild(ray)
    }
}

function destroyHelpers(domElement = document) {
    for (const helper of domElement.querySelectorAll('.coord-helpers')) {
        helper.parentNode.removeChild(helper)
    }
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
  
    circle.style.width = '5px' // Adjust the size as needed
    circle.style.height = '5px' // Adjust the size as needed
    circle.style.borderRadius = '50%'
    circle.style.background = color
  
    // Set the position using top and left properties
    circle.style.position = 'absolute'
    const navOffset = document.querySelector('nav')?.offsetHeight ?? 0
    circle.style.top = `${top - navOffset}px`
    circle.style.position = 'absolute'
    circle.style.left = left + 'px'
    circle.style.transform = 'translate(-50%,-50%)'
  
    // Add a class to the circle's classList
    circle.classList.add('coord-helpers')
  
    // Append the circle to the body (or any other desired container)
    return circle
}

function buildRay(startX, startY, endX, endY, color = 'black') {
    // Create a new div element for the ray
    const ray = document.createElement('div')
  
    // Calculate the length and angle of the ray
    const length = 300
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
    ray.classList.add('coord-helpers')
  
    // Append the ray to the body (or any other desired container)
    return ray
}

class Pipe extends THREE.Curve {
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