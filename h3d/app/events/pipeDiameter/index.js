import { nextBiggest, nextSmallest } from '../../utils/math.js'
import { AppModes } from '../h3dModes.js'
import { PipeMesh, allowedPipeDiametersByMaterial } from '../pipeConstructor/PipeMesh.js'
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
            const newDiameter = parseInt(prompt('Enter new diameter (between 8 and 110 mm):'))
            if (!newDiameter) return
            if (!diameterIsValid(newDiameter)) {
                message('Please enter a diameter between 8 and 110 mm.', 'bad')
                return
            }
            const newDiameters = new Array(pipeMeshes.length).fill(newDiameter)
            const command = new SetPipeDiameter(pipeMeshes, newDiameters)
            historyManager.executeCommand(command)
        }
    }

    function incrementDiameterOfSelectedPipes(evt) {
        if (['<', '>'].includes(evt.key)) {
            if (app.mode !== AppModes.View) return
            const pipeMeshes = getSelectedPipeMeshes(app)
            if (!pipeMeshes.length) return
            const increment = evt.key === '>'
            const oldDiameters = pipeMeshes.map(p => p.getDiameter())
            const newDiameters = pipeMeshes.map(p => increment ? getIncreasedDiameter(p) : getDecreasedDiameter(p))
            if (JSON.stringify(newDiameters) === JSON.stringify(oldDiameters)) return
            const command = new SetPipeDiameter(pipeMeshes, newDiameters)
            historyManager.executeCommand(command)
        }
    }
    domElement.addEventListener('keydown', setDiameterOfSelectedPipes)
    domElement.addEventListener('keydown', incrementDiameterOfSelectedPipes)
}

/**
 * 
 * @param {import('../../appHeat3d.js').Heat3DModel} app 
 * @returns {PipeMesh[]}
 */
function getSelectedPipeMeshes(app) {
    const {
        selectedObjectsSettings: { selectedObjects },
    } = app
    return selectedObjects.map(info => info.object)
        .filter(object => object instanceof PipeMesh)
}

function getIncreasedDiameter(pipeMesh) {
    const diameter = pipeMesh.getDiameter()
    const materialType = pipeMesh.getMaterialType().name
    const allowedPipeDiameters = allowedPipeDiametersByMaterial[materialType]
    return nextBiggest(allowedPipeDiameters, diameter)
}

function getDecreasedDiameter(pipeMesh) {
    const diameter = pipeMesh.getDiameter()
    const materialType = pipeMesh.getMaterialType().name
    const allowedPipeDiameters = allowedPipeDiametersByMaterial[materialType]
    return nextSmallest(allowedPipeDiameters, diameter)
}

function diameterIsValid(diameter) {
    return diameter >= 8 && diameter <= 110
}
