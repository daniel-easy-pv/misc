import { UNITS } from '../../consts.js'
import { addPipeContinuationListener } from './pipeContinuation.js'
import { addPipeAnchoringListener } from './pipeAnchoring.js'
import { addPipeKeyboardListeners } from './pipeKeyboardListeners.js'

/**
 * A function that adds pipe run listeners to a canvas
 * 
 * @param {import('../../appHeat3d.js').Heat3DModel} app 
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
