import { UndoableEvent } from '../historyManager.js'

/**
 * This event ends a pipe run.
 */
export class EndPipeRun extends UndoableEvent {
    constructor(app, pipeListenerSettings) {
        super()
        this.app = app
        this.pipeListenerSettings = pipeListenerSettings
    }

    execute() {
        const {
            pipeListenerSettings
        } = this
        const {
            anchors,
            tempPipes,
        } = pipeListenerSettings

        // save for undo event
        this.savedAnchors = anchors.slice()
        anchors.length = 0
        tempPipes.clear()
    }

    undo() {
        const {
            anchors,
        } = this.pipeListenerSettings
        anchors.push(...this.savedAnchors)
    }
}