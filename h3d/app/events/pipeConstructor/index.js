import * as THREE from 'three'
import { getMeshByUserDataValue } from '../../utils.js'
import { UNITS } from '../../consts.js'
import { HistoryManager } from '../historyManager.js'
import { addPipeContinuationListener } from './pipeContinuation.js'
import { addPipeAnchoringListener } from './pipeAnchoring.js'
import { addPipeKeyboardListeners } from './pipeKeyboardListeners.js'

/**
 * A function that adds pipe run listeners to a canvas
 * 
 * @param {import('../../appHeat3d.js').Heat3DModel} app 
 */
export function addPipeListener(app) {
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

    const pipeListenerSettings = {
        pipeGroup,
        anchors,
        tempPipes,
        euler,
        historyManager,
    }

    addPipeAnchoringListener(app, pipeListenerSettings)
    addPipeContinuationListener(app, pipeListenerSettings)
    addPipeKeyboardListeners(app, pipeListenerSettings)
    // addDebugPipeListener(app, anchors, euler)
    
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