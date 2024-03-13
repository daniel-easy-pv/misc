import * as THREE from 'three'
import { addPipeContinuationListener } from './pipeContinuation.ts'
import { addPipeAnchoringListener } from './pipeAnchoring.js'
import { addPipeKeyboardListeners } from './pipeKeyboardListeners.ts'

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
 * @param {import('../../appHeat3d.ts').Heat3DModel} app 
 */
export function addPipeListener(app) {
    addPipeAnchoringListener(app)
    addPipeContinuationListener(app)
    addPipeKeyboardListeners(app) 
}

/**
 * Returns the coordinate frame after rotating the standard frame by an Euler angle.
 * 
 * @param {THREE.Euler} euler
 */
export function get3Frame(euler) {
    return UNITS.map(v => v.clone().applyEuler(euler))
}
