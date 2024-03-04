import * as THREE from 'three'
import { UndoableEvent } from '../historyManager.js'
import { ScreenPosition } from '../../ScreenPosition'
import { argmin } from '../../utils/math.js'
import { LAYER_MAGENTA_SPHERES } from '../../consts'
import { PipeCurve } from './PipeCurve'
import { AppModes } from '../h3dModes.js'
import { get3Frame } from './index.js'
export function addPipeContinuationListener(app, pipeListenerSettings) {
    const {
        domElement,
        threeElements,
    } = app
    const {
        scene,
    } = threeElements
    const {
        pipeGroup,
        anchors,
        euler,
        historyManager,
    } = pipeListenerSettings
    let {
        tempPipes,
    } = pipeListenerSettings

    domElement.addEventListener('stationaryClick', function extendPipe(evt) {
        // apply listener for Insert mode and when there is an anchor
        if (app.mode !== AppModes.Insert) return
        if (anchors.length === 0) return 
        const domElementOffset = new THREE.Vector2(domElement.offsetLeft, domElement.offsetTop)
        const mousePos = new THREE.Vector2(evt.detail.endX, evt.detail.endY).addScaledVector(domElementOffset, -1)
        const anchor = anchors[anchors.length - 1]
        const secondClick = findSecondClick(
            app, anchor, euler, mousePos)
        const command = new AddIntermediatePipeNode(pipeGroup, anchors, secondClick)
        historyManager.executeCommand(command)
    
        // add imaginary valve for future pipe connections
        const imaginaryValve = new THREE.Group()
        imaginaryValve.userData.isPipeEntry = true
        imaginaryValve.position.copy(secondClick)
        pipeGroup.add(imaginaryValve)

        domElement.dispatchEvent(new CustomEvent('updateFuschia'))
    })

    // Displays potential pipe leg
    domElement.addEventListener('mousemove', function(evt) {
        if (app.mode !== AppModes.Insert) return
        if (anchors.length === 0) return
        const domElementOffset = new THREE.Vector2(domElement.offsetLeft, domElement.offsetTop)
        const mousePos = new THREE.Vector2(evt.clientX, evt.clientY).addScaledVector(domElementOffset, -1)
        const anchor = anchors[anchors.length - 1]
        const potentialSecondClick = findSecondClick(
            app, anchor, euler, mousePos)
        const path = new PipeCurve([anchor, potentialSecondClick])
        const geometry = new THREE.TubeGeometry(path, 20, 50, 8, false)
        const material = PipeCurve.Material
        const mesh = new THREE.Mesh(geometry, material)
        tempPipes.clear()
        tempPipes.add(mesh)
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
}



/**
 * @typedef {Object} CandidateObject
 * @property {THREE.Vector3[]} candidates
 * @property {THREE.Vector2[]} circles - candidates in pixel coordinates
 * @property {number} closestCandidateIndex - the index in the vector `candidates` whose distance 
 * is closest to the mouse
 * @property {THREE.Vector2} closestCircle - `circles[closestCandidateIndex]`
 * @property {number} closestCircleDistance - distance between closestCircle and mouse position
 * @property {THREE.Vector3} candidate - `candidates[closestCandidateIndex]`
 */

/**
 * 
 * @param {import('../../appHeat3d.js').Heat3DModel} app 
 * @param {THREE.Vector3} anchor 
 * @param {THREE.Euler} euler 
 * @param {THREE.Camera} camera 
 * @param {THREE.Vector2} mousePos 
 * @returns 
 */
function findSecondClick(app, anchor, euler, mousePos) {
    const THRESHOLD = 40 // px
    const {
        closestCircleDistance,
        closestCandidate,
    } = findClosestCandidateToSnap(app, anchor, euler, mousePos)
    if (closestCircleDistance < THRESHOLD) {
        return closestCandidate
    }
    return underMouse(app, anchor, euler, mousePos)
}

/**
 * 
 * @param {import('../../appHeat3d.js').Heat3DModel} app 
 * @param {THREE.Vector3} anchor 
 * @param {THREE.Vector2} mousePos 
 * @returns {CandidateObject}
 */
export function findClosestCandidateToSnap(app, anchor, euler, mousePos) {
    const {
        domElement,
        threeElements,
    } = app
    const {
        scene,
        camera,
    } = threeElements
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
    const closestCircle = circles[closestCandidateIndex]
    const closestCircleDistance = mousePos.clone().sub(closestCircle).length()
    return {
        candidates,
        circles,
        closestCircle,
        closestCircleDistance,
        closestCandidateIndex,
        closestCandidate,
    }
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
            if (intersection.object.userData.isWall) {
                const RADIATOR_HALF_THICKNESS = 100
                const point = direction.clone()
                    .multiplyScalar(intersection.distance - RADIATOR_HALF_THICKNESS)
                    .add(anchor)
                pointsToSnap.push(point)
            } else {
                pointsToSnap.push(intersection.point)
            }
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

/**
 * Returns the 3D position under the mouse, snapped to the closest axis.
 * 
 * @param {import('../../appHeat3d.js').Heat3DModel} app 
 * @param {THREE.Vector3} anchor 
 * @param {THREE.Euler} euler 
 * @param {THREE.Vector2} mousePos 
 * @returns {THREE.Vector3}
 */
function underMouse(app, anchor, euler, mousePos) {
    const {
        domElement,
        threeElements,
    } = app
    const {
        camera,
    } = threeElements
    const UNIT = 1000 // distance from anchor to another point on each of the 3 axes, must be large enough for accuracy
    const axes = get3Frame(euler)
    const axesTranslated = axes.map(axis => anchor.clone().addScaledVector(axis, UNIT))
    const screenPosition = new ScreenPosition(domElement, camera)
    // project axes to 2D
    const po = screenPosition.toPixels(anchor)
    const pm = mousePos.clone().sub(po)
    const deltas = axesTranslated.map(v => screenPosition.toPixels(v))
        .map(v => v.clone().addScaledVector(po, -1).normalize())
    const qs = deltas.map(v => v.clone().multiplyScalar(v.dot(pm)))
    const projections = qs.map(v => v.clone().add(po))
    // find position in 3D scene
    const distances = projections.map(p => p.clone().sub(mousePos).length())
    const closestIndex = argmin(distances, i => i)
    const scale = getRatioPixelToMM(domElement, camera, closestIndex)
    const lengthInPixels = projections[closestIndex].clone().sub(po).length()
    const signedLengthInPixels = lengthInPixels * Math.sign(deltas[closestIndex].dot(pm))
    const signedLengthInMM = signedLengthInPixels * scale
    const target3 = axes[closestIndex].clone()
        .multiplyScalar(signedLengthInMM).add(anchor)

    return target3
}

/**
 * Returns the ratio pixel to mm. E.g. if result is 10, then 1px = 10mm.
 * 
 * @param {HTMLDivElement} domElement 
 * @param {THREE.Camera} camera 
 * @param {0|1|2} directionIndex
 * @returns {number}
 */
function getRatioPixelToMM(domElement, camera, directionIndex) {
    if (!camera.isOrthographicCamera) {
        throw Error('To use scale, camera must be orthographic')
    }
    const LENGTH_OF_RULER = 10000
    const v0 = new THREE.Vector3(0, 0, 0)
    const v1 = new THREE.Vector3(0, 0, 0)
    v1[['x','y','z'][directionIndex]] = LENGTH_OF_RULER
    const sp = new ScreenPosition(domElement, camera)
    const p0 = sp.toPixels(v0)
    const p1 = sp.toPixels(v1)
    const l = p1.clone().sub(p0).length()
    return LENGTH_OF_RULER / l
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
