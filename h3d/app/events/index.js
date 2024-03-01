import { addModeListener } from './h3dModes'
import { addMouseListeners } from './h3dMouseListeners'
import { addPipeListener } from './pipeConstructor'


export function initEvents(app) {  
    addMouseListeners(app)
    addPipeListener(app)
    addModeListener(app)
}
