import { addDeleteObjectsListeners } from './deleteObjects/deleteObjects.js'
import { addModeListener } from './h3dModes.js'
import { addMouseListeners } from './h3dMouseListeners.ts'
import { addWindowListeners } from './h3dWindowListeners.js'
import { addPipeListener } from './pipeConstructor/addPipeListener.js'
import { addPipeDiameterListener } from './pipeDiameter/pipeDiameter.js'
import { addSelectObjectsListener } from './selectObjects/selectObjects.js'


export function initEvents(app) {  
    addMouseListeners(app)
    addPipeListener(app)
    addModeListener(app)
    addWindowListeners(app)
    addSelectObjectsListener(app)
    addPipeDiameterListener(app)
    addDeleteObjectsListeners(app)
}
