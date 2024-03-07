import { addModeListener } from './h3dModes'
import { addMouseListeners } from './h3dMouseListeners'
import { addWindowListeners } from './h3dWindowListeners'
import { addPipeListener } from './pipeConstructor/index.js'
import { addSelectObjectsListener } from './selectObjects/index.js'


export function initEvents(app) {  
    addMouseListeners(app)
    addPipeListener(app)
    addModeListener(app)
    addWindowListeners(app)
    addSelectObjectsListener(app)
}
