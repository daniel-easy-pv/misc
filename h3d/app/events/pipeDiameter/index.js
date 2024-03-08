import { AppModes } from '../h3dModes.js'
import { PipeMesh } from '../pipeConstructor/PipeMesh.js'
import { SetPipeDiameter } from './eventSetPipeDiameter.js'

/* globals message */

/**
 * A function that adds pipe diameter change listeners to a canvas
 * 
 * @param {import('../../appHeat3d.js').Heat3DModel} app 
 */
export function addPipeDiameterListener(app) {
    addChangeDiameterListener(app)
}

/**
 * A function that changes the diameter of selected pipes
 * 
 * @param {import('../../appHeat3d.js').Heat3DModel} app 
 */
function addChangeDiameterListener(app) {
    const {
        domElement,
        selectedObjectsSettings,
        pipeListenerSettings: { historyManager },
    } = app

    const {
        selectedObjects,
    } = selectedObjectsSettings

    /**
     * In View mode, press `d` to change the diameter of selected pipes.
     * 
     * @param {KeyboardEvent} evt 
     * @returns 
     */
    function changePipeDiameter(evt) {
        if (app.mode !== AppModes.View) return
        const PIPE_INCREMENT = 5
        const pipeMeshes = selectedObjects.map(info => info.object)
            .filter(object => object instanceof PipeMesh)
        if (evt.key === 'd') {
            const newDiameter = parseInt(prompt('Enter new diameter (between 10 and 110 mm):'))
            if (!newDiameter) return
            if (!diameterIsValid(newDiameter)) {
                message('Please enter a diameter between 10 and 110 mm.', 'bad')
                return
            }
            const command = new SetPipeDiameter(app, newDiameter)
            historyManager.executeCommand(command)
        }
        else if (['<', '>'].includes(evt.key)) {
            for (const pipeMesh of pipeMeshes) {
                const diameter = pipeMesh.getDiameter()
                const sign = evt.key === '>' ? 1 : -1
                const newDiameter = diameter + PIPE_INCREMENT * sign
                if (diameterIsValid(newDiameter)) {
                    pipeMesh.setDiameter(newDiameter)
                }
            }
        }
    }
    domElement.addEventListener('keydown', changePipeDiameter)
}

function diameterIsValid(diameter) {
    return diameter >= 10 && diameter <= 110
}
