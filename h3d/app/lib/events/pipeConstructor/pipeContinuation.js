import * as THREE from 'three'
import { ScreenPosition } from '../../utils/ScreenPosition.js'
import { argmin } from '../../utils/math.js'
import { PipeMesh } from './PipeMesh.js'
import { AppModes } from '../h3dModes.js'
import { get3Frame } from './addPipeListener.js'
import { pipeSnapRuleIntersect } from './pipeSnapRuleIntersect.js'
import { pipeSnapRuleValve } from './pipeSnapRuleValve.js'
import { AddIntermediatePipeNode } from './eventAddIntermediatePipeNode.js'

/**
 * 
 * @param {import('../../appHeat3d.js').Heat3DModel} app 
 */
export function addPipeContinuationListener(app) {
    const {
        domElement,
        pipeListenerSettings,
    } = app
    const {
        anchors,
        historyManager,
        tempPipes,
    } = pipeListenerSettings

    /**
     * On stationary click, add another pipe leg.
     * This runs only in Insert mode and when there is an anchor.
     * 
     * @param {CustomEvent<import('../h3dMouseListeners.js').StationaryClickEventDetails>} evt 
     * @returns {void}
     */
    function extendPipe(evt) {
        if (app.mode !== AppModes.Insert) return
        if (anchors.length === 0) return 
        const domElementOffset = new THREE.Vector2(domElement.offsetLeft, domElement.offsetTop)
        const mousePos = new THREE.Vector2(
            evt.detail.endEvent.clientX, 
            evt.detail.endEvent.clientY)
            .sub(domElementOffset)
        const {
            snapPoint,
            endPipeRun,
        } = findSecondClickDetailed(app, mousePos)
        const command = new AddIntermediatePipeNode(pipeListenerSettings, snapPoint, endPipeRun)
        historyManager.executeCommand(command)
    }
    

    /**
     * Creates a temporary mesh that follows the mouse around.
     * 
     * @param {MouseEvent} evt 
     * @returns {void}
     */
    function createTempMesh(evt) {
        if (app.mode !== AppModes.Insert) return
        if (anchors.length === 0) return
        const domElementOffset = new THREE.Vector2(domElement.offsetLeft, domElement.offsetTop)
        const mousePos = new THREE.Vector2(evt.clientX, evt.clientY).sub(domElementOffset)
        const anchor = anchors[anchors.length - 1]
        const {
            snapPoint,
            callbacks,
        } = findSecondClickDetailed(app, mousePos)
        callbacks.forEach(f => f())
        const {
            pipeDiameter,
            pipeMaterial,
        } = pipeListenerSettings
        const start = [anchor.x, anchor.y, anchor.z]
        const end = [snapPoint.x, snapPoint.y, snapPoint.z]
        const diameter = pipeDiameter
        const pipeMaterialName = pipeMaterial.name
        const pipeMesh = new PipeMesh({ start, end, diameter, pipeMaterialName })
        tempPipes.clear()
        tempPipes.add(pipeMesh)
    }

    domElement.addEventListener('stationaryClick', extendPipe)
    domElement.addEventListener('mousemove', createTempMesh)
}

/**
 * Given a mouse click that attempts to extend a pipe, we snap to points with the following priorities.
 * 1. within `PIPE_SNAP_RULE_INTERSECT_THRESHOLD` of an intersection of an object in scene (or near a wall).
 * 2. if one of the coordinates match a valve coordinate within `PIPE_SNAP_RULE_INTERSECT_VALVE`mm.
 * 3. freehand
 * 
 * @param {import('../../appHeat3d.js').Heat3DModel} app 
 * @param {THREE.Vector2} mousePos 
 */
function findSecondClickDetailed(app, mousePos) {
    const callbacks = []
    // RULE 1
    const rule1Result = pipeSnapRuleIntersect(app, mousePos)
    callbacks.push(rule1Result.callback)
    
    // RULE 2
    const {
        target3,
        closestAxisIndex,
    } = underMouse(app, mousePos)
    const rule2Result = pipeSnapRuleValve(app, target3, closestAxisIndex)
    callbacks.push(rule2Result.callback)
    
    if (rule1Result.ok) {
        return {
            snapPoint: rule1Result.value,
            endPipeRun: rule1Result.endPipeRun,
            callbacks,
        }
    }
    else if (rule2Result.ok) {
        return {
            snapPoint: rule2Result.value,
            endPipeRun: false,
            callbacks,
        }
    }
    else {
        // RULE 3
        return {
            snapPoint: target3,
            endPipeRun: false,
            callbacks,
        }
    }
}


/**
 * Returns the 3D position under the mouse, snapped to the closest axis.
 * 
 * @param {import('../../appHeat3d.js').Heat3DModel} app 
 * @param {THREE.Vector2} mousePos 
 */
function underMouse(app, mousePos) {
    const {
        domElement,
        threeElements,
        pipeListenerSettings,
    } = app
    const {
        camera,
    } = threeElements
    const {
        anchors,
        euler,
    } = pipeListenerSettings
    const anchor = anchors[anchors.length - 1]
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
    const closestAxisIndex = argmin(distances, i => i)
    const scale = getRatioPixelToMM(domElement, camera, axes[closestAxisIndex])
    const lengthInPixels = projections[closestAxisIndex].clone().sub(po).length()
    const signedLengthInPixels = lengthInPixels * Math.sign(deltas[closestAxisIndex].dot(pm))
    const signedLengthInMM = signedLengthInPixels * scale
    const target3 = axes[closestAxisIndex].clone()
        .multiplyScalar(signedLengthInMM).add(anchor)

    return {
        target3,
        closestAxisIndex,
    }
}

/**
 * Returns the ratio pixel to mm. E.g. if result is 10, then 1px = 10mm.
 * 
 * @param {HTMLDivElement} domElement 
 * @param {THREE.Camera} camera 
 * @param {THREE.Vector3} direction
 * @returns {number}
 */
function getRatioPixelToMM(domElement, camera, direction) {
    if (!camera.isOrthographicCamera) {
        throw Error('To use scale, camera must be orthographic')
    }
    const LENGTH_OF_RULER = 10000
    const v0 = new THREE.Vector3(0, 0, 0)
    const v1 = direction.clone().normalize().multiplyScalar(LENGTH_OF_RULER)
    const sp = new ScreenPosition(domElement, camera)
    const p0 = sp.toPixels(v0)
    const p1 = sp.toPixels(v1)
    const l = p1.clone().sub(p0).length()
    return LENGTH_OF_RULER / l
}


