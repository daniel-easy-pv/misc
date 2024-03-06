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
        if (this.history.length > 0 && this.historyIndex >= 0) {
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