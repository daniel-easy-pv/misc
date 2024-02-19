import { ScreenPosition } from './ScreenPosition'
import { getMeshByUserDataValue } from './utils'

export function initEvents(domElement, {
    scene,
    camera,
    pointer,
    raycaster,
} = {}) {
    domElement.addEventListener('mousemove', function onPointerMove(event) {
        const elementRect = domElement.getBoundingClientRect()
        pointer.x = ((event.clientX - elementRect.left) / domElement.clientWidth) * 2 - 1
        pointer.y = -((event.clientY - elementRect.top) / domElement.clientHeight) * 2 + 1
    })
    // domElement.addEventListener('click', function() {
    //     raycaster.setFromCamera(pointer, camera)
    //     const intersects = raycaster.intersectObjects(scene.children)
    //         .filter(intersection => intersection.object.userData.slateClass === 'Radiator')
    //     if (intersects.length > 0) {
    //         console.log(intersects[0])
    //     }
    // })
    domElement.addEventListener('click', function heyRadiators() {
        const radiators = getMeshByUserDataValue(scene, 'slateClass', 'Radiator')
        const positions = new ScreenPosition(domElement, camera)
        console.log(radiators)
        console.log(radiators.map(radiator => positions.toNormalized(radiator.position)))
    })
}