import { PipeMaterial } from '../../../materials/PipeMaterial.js'
import { nextBiggest, nextSmallest } from '../../utils/math.js'
import { allowedPipeDiametersByMaterial } from './PipeMesh.js'
import { EndPipeRun } from './eventEndPipeRun.js'

/**
 * 
 * @param {import('../../appHeat3d.js').Heat3DModel} app 
 */
export function addPipeKeyboardListeners(app) {
    const {
        domElement,
        pipeListenerSettings,
    } = app
    const {
        euler,
        historyManager,
    } = pipeListenerSettings
    domElement.addEventListener('keydown', function(evt) {
        if (evt.key === 'r') {
            euler.z += Math.PI / 4
        }
        else if (evt.key === 'e') {
            const command = new EndPipeRun(pipeListenerSettings)
            historyManager.executeCommand(command)
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

    domElement.addEventListener('keydown', function(evt) {
        if (['<', '>'].includes(evt.key)) {
            const currentDiameter = pipeListenerSettings.pipeDiameter
            const currentMaterial = pipeListenerSettings.pipeMaterial.name
            const allowedPipeDiameters = allowedPipeDiametersByMaterial[currentMaterial]
            const newDiameter = evt.key === '>' ? 
                nextBiggest(allowedPipeDiameters, currentDiameter) :
                nextSmallest(allowedPipeDiameters, currentDiameter)
            pipeListenerSettings.pipeDiameter = newDiameter
        }
    })

    domElement.addEventListener('keydown', function(evt) {
        if (evt.key === 'c') {
            pipeListenerSettings.pipeMaterial = PipeMaterial.Copper
        } else if (evt.key === 'p') {
            pipeListenerSettings.pipeMaterial = PipeMaterial.Plastic
        }
    })
}