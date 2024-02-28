import { PipeCurve } from './PipeCurve'
import * as THREE from 'three'

/**
 * Represents an event that can be executed and undone, allowing for history tracking.
 * @interface
 */
export class UndoableEvent {
    /**
     * Executes the event.
     * @abstract
     */
    execute() {}

    /**
     * Undoes the previously executed event.
     * @abstract
     */
    undo() {}
}

export class AddIntermediatePipeNode extends UndoableEvent {
    constructor(pipeGroup, anchors, secondClick) {
        super()
        if (anchors.length === 0) {
            throw Error('Pipe source not found')
        }
        const anchor = anchors[0]
        this.pipeGroup = pipeGroup
        this.anchors = anchors
        this.anchor = anchor
        this.secondClick = secondClick

        const path = new PipeCurve([anchor, secondClick])
        const geometry = new THREE.TubeGeometry(path, 20, 50, 8, false)
        const material = PipeCurve.Material
        const mesh = new THREE.Mesh(geometry, material)
        this.mesh = mesh
    }

    execute() {
        const { pipeGroup, mesh, anchors, secondClick } = this
        pipeGroup.add(mesh)
        anchors.length = 0
        anchors.push(secondClick)
    }

    undo() {
        const { pipeGroup, mesh, anchors, anchor } = this
        pipeGroup.remove(mesh)
        if (anchors.length) {
            anchors.length = 0
            anchors.push(anchor)
        }
    }
}

/**
 * Manages a history of executed events, providing the ability to undo them.
 */
export class HistoryManager {
    /**
     * Creates a new HistoryManager instance with an empty history.
     */
    constructor() {
        /**
         * The array to store the history of executed events.
         * @type {UndoableEvent[]}
         */
        this.history = []
        /**
         * This keeps track of where we are in the history as we press undo and redo.
         * @type {number}
         */
        this.historyIndex = -1
    }

    /**
     * Executes a given command, adds it to the history, and updates the history.
     * @param {UndoableEvent} command - The command to be executed and recorded.
     */
    executeCommand(command) {
        command.execute()
        this.historyIndex++
        this.history.length = this.historyIndex
        this.history[this.historyIndex] = command
    }

    /**
     * Undoes the last executed command in the history if available.
     */
    undo() {
        if (this.history.length > 0) {
            /**
             * Retrieves the last executed command from the history.
             * @type {UndoableEvent}
             */
            const lastCommand = this.history[this.historyIndex]
            lastCommand.undo()
            this.historyIndex--
        }
    }

    /**
     * Redoes the last undone command if available.
     */
    redo() {
        const command = this.history[this.historyIndex + 1]
        if (command) {
            command.execute()
            this.historyIndex++
        }
    }
}