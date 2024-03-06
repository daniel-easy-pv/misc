import * as THREE from 'three'
import { get3Frame } from './index.js'
import { ScreenPosition } from '../../ScreenPosition.js'
import { argmin } from '../../utils/math.js'

export function pipeSnapRuleIntersect(app, anchor, euler, mousePos) {
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
        return {
            ok: true,
            value: snapPoint,
            callback: uiChangeRule1,
        }
    }
    else {
        return {
            ok: false,
            callback: uiChangeRule1,
        }
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
 * Returns the coordinate frame after rotating the standard frame by an Euler angle.
 * 
 * @param {THREE.Euler} euler
 */
function get6Frame(euler) {
    const frame = get3Frame(euler)
    const negativeFrame = frame.map(v => v.clone().multiplyScalar(-1))
    return frame.concat(negativeFrame)
}