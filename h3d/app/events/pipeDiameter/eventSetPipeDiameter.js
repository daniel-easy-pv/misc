import { UndoableEvent } from '../historyManager.js'

/**
 * Sets the diameter of selected pipes.
 */
export class SetPipeDiameter extends UndoableEvent {
    /**
     * 
     * @param {import('../pipeConstructor/PipeMesh.js').PipeMesh[]} pipeMeshes 
     * @param {number} newDiameter
     */
    constructor(pipeMeshes, newDiameter) {
        super()
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
