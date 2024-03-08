import { AppModes } from '../h3dModes.js'
import { PipeMesh } from '../pipeConstructor/PipeMesh.js'
import { SetPipeDiameter } from './eventSetPipeDiameter.js'
import { IncrementPipeDiameter } from './incrementPipeDiameter.js'

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
        pipeListenerSettings: { historyManager },
    } = app

    /**
     * In View mode, press `d` to change the diameter of selected pipes.
     * 
     * @param {KeyboardEvent} evt 
     * @returns 
     */
    function setDiameterOfSelectedPipes(evt) {
        if (evt.key === 'd') {
            if (app.mode !== AppModes.View) return
            const pipeMeshes = getSelectedPipeMeshes(app)
            if (!pipeMeshes.length) return
            const newDiameter = parseInt(prompt('Enter new diameter (between 10 and 110 mm):'))
            if (!newDiameter) return
            if (!diameterIsValid(newDiameter)) {
                message('Please enter a diameter between 10 and 110 mm.', 'bad')
                return
            }
            const command = new SetPipeDiameter(pipeMeshes, newDiameter)
            historyManager.executeCommand(command)
        }
    }

    function incrementDiameterOfSelectedPipes(evt) {
        if (['<', '>'].includes(evt.key)) {
            if (app.mode !== AppModes.View) return
            const PIPE_INCREMENT = 5
            const pipeMeshes = getSelectedPipeMeshes(app)
            if (!pipeMeshes.length) return
            const sign = evt.key === '>' ? 1 : -1
            const increment = PIPE_INCREMENT * sign
            const command = new IncrementPipeDiameter(pipeMeshes, increment)
            historyManager.executeCommand(command)
        }
    }
    domElement.addEventListener('keydown', setDiameterOfSelectedPipes)
    domElement.addEventListener('keydown', incrementDiameterOfSelectedPipes)
}


function getSelectedPipeMeshes(app) {
    const {
        selectedObjectsSettings: { selectedObjects },
    } = app
    return selectedObjects.map(info => info.object)
        .filter(object => object instanceof PipeMesh)
}

function diameterIsValid(diameter) {
    return diameter >= 10 && diameter <= 110
}
