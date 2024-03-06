import { EndPipeRun } from './pipeEndRun.js'

/**
 * 
 * @param {import('../../appHeat3d.js').Heat3DModel} app 
 * @param {import('.').PipeListenerSettings} pipeListenerSettings 
 */
export function addPipeKeyboardListeners(app, pipeListenerSettings) {
    const {
        domElement,
    } = app
    const {
        euler,
        historyManager,
    } = pipeListenerSettings
    domElement.addEventListener('keydown', function(evt) {
        if (evt.key === 'r') {
            euler.z += Math.PI / 4
        }
        else if (evt.key === 'e') {
            const command = new EndPipeRun(app, pipeListenerSettings)
            historyManager.executeCommand(command)
        }
    })

    domElement.addEventListener('keydown', function(evt) {
        if (evt.ctrlKey && evt.key === 'z') {
            historyManager.undo()
        }
    })

    domElement.addEventListener('keydown', function(evt) {
        if (evt.ctrlKey && evt.key === 'y') {
            historyManager.redo()
        }
    })
}