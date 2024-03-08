import { UndoableEvent } from '../historyManager.js'
import { PipeMesh } from '../pipeConstructor/PipeMesh.js'

/**
 * Sets the diameter of selected pipes.
 */
export class SetPipeDiameter extends UndoableEvent {
    /**
     * 
     * @param {import('../../appHeat3d.js').Heat3DModel} app 
     * @param {number} newDiameter
     */
    constructor(app, newDiameter) {
        super()
        const {
            selectedObjectsSettings,
        } = app
        const {
            selectedObjects,
        } = selectedObjectsSettings
        const pipeMeshes = selectedObjects.map(info => info.object)
            .filter(object => object instanceof PipeMesh)
        this.pipeMeshes = pipeMeshes
        this.originalDiameters = pipeMeshes.map(m => m.getDiameter())
        this.newDiameter = newDiameter
    }

    execute() {
        const {
            pipeMeshes,
            newDiameter,
        } = this
        for (const pipeMesh of pipeMeshes) {
            pipeMesh.setDiameter(newDiameter)
        }
    }

    undo() {
        const {
            pipeMeshes,
            originalDiameters,
        } = this
        for (let i = 0; i < pipeMeshes.length; i++) {
            pipeMeshes[i].setDiameter(originalDiameters[i])
        }
    }
}
