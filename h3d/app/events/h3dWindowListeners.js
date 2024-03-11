import { FRUSTUM_SIZE } from '../heat/appHeat3d'

export function addWindowListeners(app) {
    const {
        threeElements,
        domElement,
    } = app
    const {
        camera,
        renderer,
    } = threeElements
    window.addEventListener('resize', function() {
        const aspect = domElement.offsetWidth / domElement.offsetHeight
        renderer.setSize(domElement.offsetWidth, domElement.offsetHeight)
        // update the camera
        camera.left = FRUSTUM_SIZE/-2 * aspect
        camera.right = FRUSTUM_SIZE/2 * aspect
        camera.top = FRUSTUM_SIZE/2
        camera.bottom = FRUSTUM_SIZE/-2
        camera.updateProjectionMatrix()
    })
}