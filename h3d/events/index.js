import { addModeListener } from './h3dModes'
import { addPipeListener } from './pipeConstructor'


export function initEvents(app) {
    const {
        domElement,
        threeElements,
    } = app
    const {
        pointer,
    } = threeElements
    domElement.addEventListener('mousemove', function onPointerMove(event) {
        const elementRect = domElement.getBoundingClientRect()
        pointer.x = ((event.clientX - elementRect.left) / domElement.clientWidth) * 2 - 1
        pointer.y = -((event.clientY - elementRect.top) / domElement.clientHeight) * 2 + 1
    })

    addPipeListener(app)
    addModeListener(app)
}
