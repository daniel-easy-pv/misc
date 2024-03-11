import { UndoableEvent } from '../historyManager.js'

/**
 * Sets the diameter of selected pipes.
 */
export class SetPipeDiameter extends UndoableEvent {
    /**
     * 
     * @param {import('../pipeConstructor/PipeMesh.js').PipeMesh[]} pipeMeshes 
     * @param {number[]} newDiameters
     */
    constructor(pipeMeshes, newDiameters) {
        super()
        this.pipeMeshes = pipeMeshes
        this.originalDiameters = pipeMeshes.map(m => m.getDiameter())
        this.newDiameters = newDiameters
    }

    execute() {
        const {
            pipeMeshes,
            newDiameters,
        } = this
        for (let i = 0; i < pipeMeshes.length; i++) {
            pipeMeshes[i].setDiameter(newDiameters[i])
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
