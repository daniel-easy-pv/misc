import { UndoableEvent } from '../historyManager.js'

/**
 * Delete every object that has been selected.
 */
export class DeleteObjects extends UndoableEvent {
    /**
     * 
     * @param {import('../../appHeat3d.js').Heat3DModel} app 
     */
    constructor(app) {
        super()
        this.app = app
        
        /**
         * @type {DeletedData}
         */
        this.deletedData = []
    }

    execute() {
        const {
            app,
            deletedData,
        } = this
        const {
            selectedObjectsSettings,
        } = app
        const {
            selectedObjects,
        } = selectedObjectsSettings
        for (const { object } of selectedObjects) {
            /**
             * @constant
             * @type {THREE.Object3D}
             */
            const parent = object.parent
            parent.remove(object)
            deletedData.push({
                parent,
                object,
            })
        }
    }

    undo() {
        const {
            deletedData,
        } = this
        for (const { parent, object } of deletedData) {
            parent.add(object)
        }
    }
}

/**
 * @typedef {Object} DeletedData
 * @property {THREE.Object3D} parent
 * @property {THREE.Object3D} object
 */
