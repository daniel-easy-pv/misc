import * as THREE from 'three'
import { HistoryManager } from '../events/historyManager'
import { getMeshByUserDataValue } from '../utils'
/**
 * Settings for a pipe listener.
 *
 * @typedef {Object} PipeListenerSettings
 * @property {THREE.Group<THREE.Object3DEventMap>} pipeGroup - The main group for pipes.
 * @property {THREE.Vector3[]} anchors - An array of anchor points.
 * @property {THREE.Group<THREE.Object3DEventMap>} tempPipes - Temporary group for pipes.
 * @property {THREE.Euler} euler - Euler angles for rotation.
 * @property {HistoryManager} historyManager - The history manager for tracking changes.
 */


export function initPipeListenerSettings(app) {
    const {
        threeElements,
    } = app
    const {
        scene,
    } = threeElements
    
    const pipeGroup = initPipeGroup(scene)
    
    const anchors = []
    const tempPipes = new THREE.Group()
    pipeGroup.add(tempPipes)
    const euler = new THREE.Euler(0, 0, 0, 'ZYX')
    const historyManager = new HistoryManager()

    /**
     * @constant
     * @type {PipeListenerSettings}
     */
    return {
        pipeGroup,
        anchors,
        tempPipes,
        euler,
        historyManager,
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