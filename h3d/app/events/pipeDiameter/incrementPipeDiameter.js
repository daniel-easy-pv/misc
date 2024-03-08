import { UndoableEvent } from '../historyManager.js'

/**
 * Increments or decrements the diameter of selected pipes.
 */
export class IncrementPipeDiameter extends UndoableEvent {
    /**
     * 
     * @param {import('../../appHeat3d.js').Heat3DModel} app 
     * @param {number} increment
     */
    constructor(pipeMeshes, increment) {
        super()
        this.pipeMeshes = pipeMeshes
        this.increment = increment
    }

    execute() {
        const {
            pipeMeshes,
            increment,
        } = this
        for (const pipeMesh of pipeMeshes) {
            const diameter = pipeMesh.getDiameter()
            const newDiameter = diameter + increment
            pipeMesh.setDiameter(newDiameter)
        }
    }

    undo() {
        const {
            pipeMeshes,
            increment,
        } = this
        for (const pipeMesh of pipeMeshes) {
            const diameter = pipeMesh.getDiameter()
            const newDiameter = diameter - increment
            pipeMesh.setDiameter(newDiameter)
        }
    }
}
