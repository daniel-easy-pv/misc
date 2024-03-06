import { AppModes } from '../h3dModes.js'
import { AddBeginningPipeNode } from './eventAddBeginningPipeNode.js'


/**
 * 
 * @param {import('../../appHeat3d.js').Heat3DModel} app 
 * @param {import('.').PipeListenerSettings} pipeListenerSettings 
 */
export function addPipeAnchoringListener(app, pipeListenerSettings) {
    const {
        domElement,
    } = app
    const {
        anchors,
        historyManager, 
    } = pipeListenerSettings

    domElement.addEventListener('stationaryClick', function anchorPipe(evt) {
        if (app.mode !== AppModes.Insert) return
        if (anchors.length !== 0) return
        evt.stopImmediatePropagation()
        const command = new AddBeginningPipeNode(app, pipeListenerSettings, evt)
        historyManager.executeCommand(command)
    })
}

