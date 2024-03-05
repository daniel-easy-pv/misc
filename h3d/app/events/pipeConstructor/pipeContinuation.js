import * as THREE from 'three'
import { UndoableEvent } from '../historyManager.js'
import { ScreenPosition } from '../../ScreenPosition'
import { argmin } from '../../utils/math.js'
import { PipeCurve } from './PipeCurve'
import { AppModes } from '../h3dModes.js'
import { get3Frame } from './index.js'
import { getValvePositions } from './valveFinder.js'
import { PipeSnapRuleFree, PipeSnapRuleIntersect, PipeSnapRuleValve } from './PipeSnapRule.js'
export function addPipeContinuationListener(app, pipeListenerSettings) {
    const {
        domElement,
    } = app
    const {
        pipeGroup,
        anchors,
        euler,
        historyManager,
        tempPipes,
    } = pipeListenerSettings

    domElement.addEventListener('stationaryClick', function extendPipe(evt) {
        // apply listener for Insert mode and when there is an anchor
        if (app.mode !== AppModes.Insert) return
        if (anchors.length === 0) return 
        const domElementOffset = new THREE.Vector2(domElement.offsetLeft, domElement.offsetTop)
        const mousePos = new THREE.Vector2(evt.detail.endX, evt.detail.endY).addScaledVector(domElementOffset, -1)
        const anchor = anchors[anchors.length - 1]
        const secondClick = findSecondClickDetailed(
            app, anchor, euler, mousePos).snapPoint
        const command = new AddIntermediatePipeNode(pipeGroup, anchors, secondClick)
        historyManager.executeCommand(command)
    
        // add imaginary valve for future pipe connections
        const imaginaryValve = new THREE.Group()
        imaginaryValve.userData.isPipeEntry = true
        imaginaryValve.position.copy(secondClick)
        pipeGroup.add(imaginaryValve)
    })

    // Displays potential pipe leg
    domElement.addEventListener('mousemove', function(evt) {
        if (app.mode !== AppModes.Insert) return
        if (anchors.length === 0) return
        const domElementOffset = new THREE.Vector2(domElement.offsetLeft, domElement.offsetTop)
        const mousePos = new THREE.Vector2(evt.clientX, evt.clientY).addScaledVector(domElementOffset, -1)
        const anchor = anchors[anchors.length - 1]
        const {
            snapPoint,
            uiChange,
        } = findSecondClickDetailed(
            app, anchor, euler, mousePos)
        uiChange?.()
        const path = new PipeCurve([anchor, snapPoint])
        const geometry = new THREE.TubeGeometry(path, 20, 50, 8, false)
        const material = PipeCurve.Material
        const mesh = new THREE.Mesh(geometry, material)
        tempPipes.clear()
        tempPipes.add(mesh)
    })
}

/**
 * Given a mouse click that attempts to extend a pipe, we snap to points with the following priorities.
 * 1. within 40px of an intersection of an object in scene (or near a wall)
 * 2. if one of the coordinates match a valve coordinate
 * 3. freehand
 * 
 * @param {import('../../appHeat3d.js').Heat3DModel} app 
 * @param {THREE.Vector3} anchor 
 * @param {THREE.Euler} euler 
 * @param {THREE.Vector2} mousePos 
 * @returns {import('./PipeSnapRule.js').PipeSnapRule}
 */
function findSecondClickDetailed(app, anchor, euler, mousePos) {
    
    // RULE 1
    const RULE_1_THRESHOLD = 40 // px
    const {
        closestCircleDistance,
        closestCandidate,
        intersectionInfos,
        closestCandidateIndex,
    } = findClosestCandidateToSnap(app, anchor, euler, mousePos)
    const rule1Applies = closestCircleDistance < RULE_1_THRESHOLD
    const uiChangeRule1 = () => {
        for (let i = 0; i < intersectionInfos.length; i++) {
            const { intersectionObject } = intersectionInfos[i]
            const materialConfig = intersectionObject.userData.materialConfig
            if (materialConfig) {
                const opacity = (i === closestCandidateIndex && rule1Applies) ? 
                    materialConfig.highlighted.opacity : 
                    materialConfig.original.opacity
                intersectionObject.material.opacity = opacity
            }
        }
    }
    if (rule1Applies) {
        const snapPoint = closestCandidate
        return new PipeSnapRuleIntersect({
            snapPoint,
            uiChange: uiChangeRule1,
        })
    }
    const {
        target3,
        closestAxisIndex,
    } = underMouse(app, anchor, euler, mousePos)
    const axis = get3Frame(euler)[closestAxisIndex]
    // RULE 2
    const RULE_2_THRESHOLD = 100
    const valves = getValvePositions(app)
    const valveProjections = valves. map(valveData => {
        const { valvePosition } = valveData
        const projectionLength = valvePosition.clone().sub(anchor).dot(axis)
        const valveProjection = axis.clone().multiplyScalar(projectionLength).add(anchor)
        return {
            valveProjection,
            ...valveData,
        }
    })

    const valveSnap = (valveProjection) => {
        return valveProjection.clone().sub(target3).length() < RULE_2_THRESHOLD
    }

    const closestValveProjection = valveProjections.find(valveData => valveSnap(valveData.valveProjection))
    if (closestValveProjection) {
        const uiChangeRule2 = () => {
            for (const valveData of valveProjections) {
                const { valveProjection, valve } = valveData
                if (valveSnap(valveProjection)) {
                    valve.material.color.setHex(0xff0000)
                } else {
                    valve.material.color.setHex(0xffff00)
                }
            }
            uiChangeRule1()
        }
        const snapPoint = closestValveProjection.valveProjection
        return new PipeSnapRuleValve({
            snapPoint,
            uiChange: uiChangeRule2,
        })
    }
    else {
        const uiChangeRule3 = () => {
            for (const valveData of valveProjections) {
                const { valve } = valveData
                valve.material.color.setHex(0xffff00)
            }
            uiChangeRule1()
        }
        const snapPoint = target3
        return new PipeSnapRuleFree({
            snapPoint,
            uiChange: uiChangeRule3,
        })
    }
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
    const intersectionInfos = intersectingCandidates(scene, anchor, euler)
    const candidates = intersectionInfos
        .map(intersectionInfo => intersectionInfo.intersectionPoint)
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
        intersectionInfos,
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
 * @typedef {Object} IntersectionInfo
 * @property {THREE.Vector3} intersectionPoint - The point where the intersection occurred.
 * @property {THREE.Object3D} intersectionObject - The 3D object that was intersected.
 */

/**
 * Given a scene of objects, and a coordinate system represented by anchor-euler,
 * return an array of intersection points from anchor in the direction of Euler.
 * If we encounter a wall, we snap near the wall rather than at the wall.
 * 
 * @param {THREE.Scene} scene 
 * @param {THREE.Vector3} anchor 
 * @param {THREE.Euler} euler 
 * @returns {IntersectionInfo[]}
 */
function intersectingCandidates(scene, anchor, euler) {
    const pointsToSnap = []
    const NEAR = 100
    const FAR = 100000 // 100 m
    const RADIATOR_HALF_THICKNESS = 100
    for (const direction of get6Frame(euler)) {
        const raycaster = new THREE.Raycaster(anchor, direction, NEAR, FAR)
        const intersectObject = raycaster.intersectObject(scene, true)
        for (const intersection of intersectObject) {
            const intersectionObject = intersection.object
            if (intersection.object.userData.isWall) {
                const intersectionPoint = direction.clone()
                    .multiplyScalar(intersection.distance - RADIATOR_HALF_THICKNESS)
                    .add(anchor)
                pointsToSnap.push({
                    intersectionPoint,
                    intersectionObject,
                })
            } else {
                const intersectionPoint = intersection.point
                pointsToSnap.push({
                    intersectionPoint,
                    intersectionObject,
                })
            }
        }
    }
    return pointsToSnap
}

/**
 * Returns the 3D position under the mouse, snapped to the closest axis.
 * 
 * @param {import('../../appHeat3d.js').Heat3DModel} app 
 * @param {THREE.Vector3} anchor 
 * @param {THREE.Euler} euler 
 * @param {THREE.Vector2} mousePos 
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
