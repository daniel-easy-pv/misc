import { UndoableEvent } from '../historyManager.js'
import { endPipeRun } from './eventEndPipeRun.js'

/**
 * Given an anchor point, this adds a pipe leg to the pipe run.
 * @param {import('.').PipeListenerSettings} pipeListenerSettings 
 * @param {import('THREE').Vector3} anchor
 */
export class AddBeginningPipeNode extends UndoableEvent {
    constructor(pipeListenerSettings, anchor) {
        super()
        this.pipeListenerSettings = pipeListenerSettings
        this.anchor = anchor
    }

    execute() {
        const {
            pipeListenerSettings,
            anchor,
        } = this
        const {
            anchors,
        } = pipeListenerSettings
        if (anchor) {
            anchors.push(anchor)
        }
    }

    undo() {
        const {
            pipeListenerSettings,
        } = this
        endPipeRun(pipeListenerSettings)
    }
}

