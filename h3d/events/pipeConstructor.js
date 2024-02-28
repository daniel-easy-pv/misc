import * as THREE from 'three'
import { ScreenPosition } from '../ScreenPosition'
import { getMeshByUserDataValue } from '../utils'
import { LAYER_MAGENTA_SPHERES, MOUSE_ACCURACY_THRESHOLD } from '../consts'
import { AppModes } from './h3dModes'
import { addDebugPipeListener } from './debugPipes'
import { PipeCurve } from './PipeCurve'
import { HistoryManager, UndoableEvent } from './historyManager'

// pipes must snap to a grid with this resolution in mm
const GRID_SNAP_DELTA = 500
const GRID_DIM = 40


/**
 * @const
 * @type {THREE.Vector3[]}
 * the standard coordinate system
 */
const UNITS = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 1),
]

/**
 * A function that adds pipe run listeners to a canvas
 * 
 * @param {import('../appHeat3d.js').Heat3DModel} app 
 */
export function addPipeListener(app) {
    const {
        domElement,
        threeElements,
    } = app
    const {
        scene,
        camera,
    } = threeElements
    
    const pipeGroup = initPipeGroup(scene)
    
    const anchors = []
    let tempMesh
    const euler = new THREE.Euler(0, 0, 0, 'ZYX')
    const historyManager = new HistoryManager()

    domElement.addEventListener('stationaryClick', function buildPipe(evt) {
        if (app.mode !== AppModes.Insert) return
        const domElementOffset = new THREE.Vector2(domElement.offsetLeft, domElement.offsetTop)
        const mousePos = new THREE.Vector2(evt.detail.endX, evt.detail.endY).addScaledVector(domElementOffset, -1)
        
        // first click
        if (anchors.length === 0) {
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
                const anchor = closestPipeEntry.getWorldPosition(new THREE.Vector3())
                anchors.push(anchor)
            }
        } else {
            const anchor = anchors[anchors.length - 1]
            const secondClick = findClosestCandidate(
                domElement, scene, anchor, euler, camera, mousePos).closestCandidate
            destroyHelpers(domElement)
            const command = new AddIntermediatePipeNode(pipeGroup, anchors, secondClick)
            historyManager.executeCommand(command)

            // add imaginary valve for future pipe connections
            const imaginaryValve = new THREE.Group()
            imaginaryValve.userData.isPipeEntry = true
            imaginaryValve.position.copy(secondClick)
            pipeGroup.add(imaginaryValve)
        }
        domElement.dispatchEvent(new CustomEvent('updateFuschia'))
    })
    
    // Displays potential pipe leg
    domElement.addEventListener('mousemove', function(evt) {
        if (app.mode !== AppModes.Insert) return
        if (anchors.length === 0) return
        const domElementOffset = new THREE.Vector2(domElement.offsetLeft, domElement.offsetTop)
        const mousePos = new THREE.Vector2(evt.clientX, evt.clientY).addScaledVector(domElementOffset, -1)
        const anchor = anchors[anchors.length - 1]
        const { 
            closestCandidateIndex, 
            candidates } = findClosestCandidate(domElement, scene, anchor, euler, camera, mousePos)
        
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
        tempFuschia.clear()
        if (anchors.length === 0) return
        const anchor = anchors[anchors.length - 1]
        const sphereGroup = candidatesOnWalls(scene, anchor, euler)
        tempFuschia.add(sphereGroup)
    })

    domElement.addEventListener('keydown', function(evt) {
        if (evt.key === 'r') {
            euler.z += Math.PI / 4
            domElement.dispatchEvent(new CustomEvent('updateFuschia'))
        }
        else if (evt.key === 'Escape') {
            anchors.length = 0
            pipeGroup.remove(tempMesh)
            destroyHelpers(domElement)
            domElement.dispatchEvent(new CustomEvent('updateFuschia'))
            anchors.length = 0
        }
    })

    domElement.addEventListener('keydown', function(evt) {
        if (evt.ctrlKey && evt.key === 'z') {
            historyManager.undo()
        }
    })

    domElement.addEventListener('keydown', function(evt) {
        if (evt.ctrlKey && evt.key === 'y') {
            historyManager.redo()
        }
    })

    addDebugPipeListener(app, anchors, euler)
    
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



/**
 * @typedef {Object} CandidateObject
 * @property {THREE.Vector3[]} candidates
 * @property {THREE.Vector2[]} circles
 * @property {number} closestCandidateIndex - the index in the vector `candidates` whose distance 
 * is closest to the mouse
 * @property {THREE.Vector3} candidate - `candidates[closestCandidateIndex]`
 */

/**
 * 
 * @param {HTMLElement} domElement 
 * @param {THREE.Vector3} anchor 
 * @param {THREE.Camera} camera 
 * @param {THREE.Vector2} mousePos 
 * @returns {CandidateObject}
 */
export function findClosestCandidate(domElement, scene, anchor, euler, camera, mousePos) {
    const candidates = candidatesToSnap(scene, anchor, euler)
    if (candidates.length === 0) {
        console.log('no candidates')
        return
    }
    const screenPosition = new ScreenPosition(domElement, camera)
    const circles = candidates.map(v => screenPosition.toPixels(v))
    const closestCandidateIndex = argmin(
        Array.from({ length: candidates.length }, (_, i) => i), 
        i => mousePos.distanceToSquared(circles[i]))
    const closestCandidate = candidates[closestCandidateIndex]
    return {
        candidates,
        circles,
        closestCandidateIndex,
        closestCandidate,
    }
}


/**
 * Returns the coordinate frame after rotating the standard frame by an Euler angle.
 * 
 * @param {THREE.Euler} euler
 */
export function get3Frame(euler) {
    return UNITS.map(v => v.clone().applyEuler(euler))
}

/**
 * Returns the coordinate frame after rotating the standard frame by an Euler angle.
 * 
 * @param {THREE.Euler} euler
 */
function get6Frame(euler) {
    const frame = get3Frame(euler)
    const negativeFrame = frame.map(v => v.clone().multiplyScalar(-1))
    return frame.concat(negativeFrame)
}

// eslint-disable-next-line no-unused-vars
function candidatesOnGrid(_domElement, anchor, euler) {
    const candidates = get3Frame(euler).flatMap(axis => {
        const seq = Array.from({ length: 2 * GRID_DIM + 1 }, (_, i) => (i - GRID_DIM) * GRID_SNAP_DELTA)
        return seq.map(l => axis.clone().multiplyScalar(l).add(anchor))
    })
    return candidates
}

/**
 * Given a scene of objects, and a coordinate system represented by anchor-euler,
 * return an array of intersection points from anchor in the direction of Euler.
 * 
 * @param {THREE.Scene} scene 
 * @param {THREE.Vector3} anchor 
 * @param {THREE.Euler} euler 
 * @returns {THREE.Vector3[]}
 */
function candidatesToSnap(scene, anchor, euler) {
    const pointsToSnap = [anchor]
    const NEAR = 100
    const FAR = 100000 // 100 m
    for (const direction of get6Frame(euler)) {
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
        sphere.layers.disable(0)
        sphere.layers.enable(LAYER_MAGENTA_SPHERES)
        sphereGroup.add(sphere)
    }
    return sphereGroup
}





function destroyHelpers(domElement) {
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

/**
 * Given an anchor point, this adds a pipe leg to the pipe run.
 */
class AddIntermediatePipeNode extends UndoableEvent {
    /**
     * 
     * @param {THREE.Group} pipeGroup 
     * @param {THREE.Vector3[]} anchors 
     * @param {THREE.Vector3} secondClick 
     */
    constructor(pipeGroup, anchors, secondClick) {
        super()
        if (anchors.length === 0) {
            throw Error('Pipe source not found')
        }
        const anchor = anchors[0]
        this.pipeGroup = pipeGroup
        this.anchors = anchors
        this.anchor = anchor
        this.secondClick = secondClick

        const path = new PipeCurve([anchor, secondClick])
        const geometry = new THREE.TubeGeometry(path, 20, 50, 8, false)
        const material = PipeCurve.Material
        const mesh = new THREE.Mesh(geometry, material)
        this.mesh = mesh
    }

    execute() {
        const { pipeGroup, mesh, anchors, secondClick } = this
        pipeGroup.add(mesh)
        anchors.length = 0
        anchors.push(secondClick)
    }

    undo() {
        const { pipeGroup, mesh, anchors, anchor } = this
        pipeGroup.remove(mesh)
        if (anchors.length) {
            anchors.length = 0
            anchors.push(anchor)
        }
    }
}




/**
 * Returns the pipe group already in the scene if exists, else creates one.
 * 
 * @param {THREE.Scene} scene 
 * @returns {THREE.Group}
 */
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