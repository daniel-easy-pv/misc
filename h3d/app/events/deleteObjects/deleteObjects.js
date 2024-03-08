import { DeleteObjects } from './eventDeleteObjects'

export function addDeleteObjectsListeners(app) {
    const {
        domElement,
        pipeListenerSettings,
    } = app
    const {
        historyManager,
    } = pipeListenerSettings
    domElement.addEventListener('keydown', function(evt) {
        if (['Backspace', 'Delete'].includes(evt.key)) {
            const command = new DeleteObjects(app)
            historyManager.executeCommand(command)
        }
    })
}