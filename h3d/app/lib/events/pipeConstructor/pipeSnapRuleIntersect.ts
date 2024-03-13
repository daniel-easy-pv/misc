import * as THREE from 'three'
import { get3Frame } from './addPipeListener.js'
import { changeMaterialEmphasis } from '../../../materials/materials.js'
import { ScreenPosition } from '../../utils/ScreenPosition.js'
import { argmin } from '../../utils/math.js'
import { Heat3DModel } from '../../../heat/appHeat3d.ts'

/**
 * A value in px to for mouse to snap to point of intersection with raycaster.
 */
const PIPE_SNAP_RULE_INTERSECT_THRESHOLD = 40

/**
 * Returns the 3D position of the intersection (or near the intersection for a wall).
 */
export function pipeSnapRuleIntersect(app: Heat3DModel, mousePos: THREE.Vector2) {
    const {
        pipeListenerSettings
    } = app
    const {
        anchors,
        euler,
    } = pipeListenerSettings
    const anchor = anchors[anchors.length - 1]
    const candidateInfo = findClosestCandidateToSnap(app, anchor, euler, mousePos)
    if (!candidateInfo) {
        return {
            ok: false,
            value: null,
            endPipeRun: false,
            callback: () => {},
        }
    }
    const {
        closestCircleDistance,
        closestCandidate,
        intersectionInfos,
        closestCandidateIndex,
    } = candidateInfo
    const rule1Applies = closestCircleDistance < PIPE_SNAP_RULE_INTERSECT_THRESHOLD

    const closestObject = intersectionInfos[closestCandidateIndex].intersectionObject
    const success = () => {
        intersectionInfos.map(info => info.intersectionObject)
            .forEach(obj => changeMaterialEmphasis('original', obj))
        changeMaterialEmphasis('highlighted', closestObject)
    }

    const failure = () => {
        for (let i = 0; i < intersectionInfos.length; i++) {
            const { intersectionObject } = intersectionInfos[i]
            changeMaterialEmphasis('original', intersectionObject)
        }
    }
    const ok = rule1Applies
    const value = ok ? closestCandidate : null
    const endPipeRun = ok ? Boolean(closestObject.userData.isValve) : false
    const callback = ok ? success : failure
    return {
        ok,
        value,
        endPipeRun,
        callback,
    }
}


interface CandidateObject {
    intersectionInfos: IntersectionInfo[];
    candidates: THREE.Vector3[];
    circles: THREE.Vector2[]; // candidates in pixel coordinates
    closestCandidateIndex: number; // the index in the vector `candidates` whose distance is closest to the mouse
    closestCircle: THREE.Vector2; // `circles[closestCandidateIndex]`
    closestCircleDistance: number; // distance between closestCircle and mouse position
    closestCandidate: THREE.Vector3; // `candidates[closestCandidateIndex]`
  }

/**
 * 
 * @param {import('../../appHeat3d.ts').Heat3DModel} app 
 */
function findClosestCandidateToSnap(app: Heat3DModel, anchor: THREE.Vector3, euler, mousePos: THREE.Vector2): CandidateObject | null {
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
        return null
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

interface IntersectionInfo {
    intersectionPoint: THREE.Vector3
    intersectionObject: THREE.Object3D
}

/**
 * Given a scene of objects, and a coordinate system represented by anchor-euler,
 * return an array of intersection points from anchor in the direction of Euler.
 * If we encounter a wall, we snap near the wall rather than at the wall.
 */
function intersectingCandidates(scene: THREE.Scene, anchor: THREE.Vector3, euler: THREE.Euler): IntersectionInfo[] {
    const NEAR = 100
    const FAR = 100000 // 100 m
    const RADIATOR_HALF_THICKNESS = 100
    const pointsToSnap = get6Frame(euler).flatMap(direction => {
        const raycaster = new THREE.Raycaster(anchor, direction, NEAR, FAR)
        const intersectObject = raycaster.intersectObject(scene, true)
        return intersectObject
        .filter(intersection => {
            const { object } = intersection
            const userData = object.userData
            return userData.isWall || userData.isValve
        })
        .map(intersection => {
            const { object: intersectionObject, distance } = intersection
            const getIntersectionPoint = (intersectionObject) => {
                if (intersectionObject.userData.isWall) {
                    return direction.clone()
                        .multiplyScalar(distance - RADIATOR_HALF_THICKNESS)
                        .add(anchor);
                } 
                else {
                    return intersection.point;
                }
            }
            const intersectionPoint = getIntersectionPoint(intersectionObject)
            return {
                intersectionPoint,
                intersectionObject,
            };
        })
    })
    return pointsToSnap
}


/**
 * Returns the coordinate frame after rotating the standard frame by an Euler angle.
 */
function get6Frame(euler: THREE.Euler) {
    const frame = get3Frame(euler)
    const negativeFrame = frame.map(v => v.clone().multiplyScalar(-1))
    return frame.concat(negativeFrame)
}