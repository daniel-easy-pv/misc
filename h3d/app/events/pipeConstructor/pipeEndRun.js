import { UndoableEvent } from '../historyManager.js'

export function endPipeRun(pipeListenerSettings) {
    const {
        anchors,
        tempPipes,
    } = pipeListenerSettings
    anchors.length = 0
    tempPipes.clear()
}

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
        } = pipeListenerSettings

        // save for undo event
        this.savedAnchors = anchors.slice()
        endPipeRun(pipeListenerSettings)
    }

    undo() {
        const {
            anchors,
        } = this.pipeListenerSettings
        anchors.push(...this.savedAnchors)
    }
}