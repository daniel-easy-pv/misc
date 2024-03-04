export function addPipeKeyboardListeners(app, pipeListenerSettings) {
    const {
        domElement,
    } = app
    const {
        anchors,
        euler,
        tempPipes,
        historyManager,
    } = pipeListenerSettings
    domElement.addEventListener('keydown', function(evt) {
        if (evt.key === 'r') {
            euler.z += Math.PI / 4
            domElement.dispatchEvent(new CustomEvent('updateFuschia'))
        }
        else if (evt.key === 'Escape') {
            anchors.length = 0
            tempPipes.clear()
            domElement.dispatchEvent(new CustomEvent('updateFuschia'))
            anchors.length = 0
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