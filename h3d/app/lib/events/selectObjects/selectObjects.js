import { AppModes } from '../h3dModes.js'

/**
 * A function that adds pipe run listeners to a canvas
 * 
 * @param {import('../../appHeat3d.ts').Heat3DModel} app 
 */
export function addSelectObjectsListener(app) {
    const {
        domElement,
        threeElements,
        selectedObjectsSettings,
    } = app
    const {
        pointer,
        camera,
        scene,
    } = threeElements
    
    const {
        selectedObjects,
        raycaster,
    } = selectedObjectsSettings


    /**
     * Selects a 3D object if clicked in View mode. 
     * Multiple objects can be selected by holding the `Ctrl` key.
     * 
     * @param {CustomEvent<import('../h3dMouseListeners.ts').StationaryClickEventDetails>} evt 
     * @returns 
     */
    function selectObjects(evt) {
        if (app.mode !== AppModes.View) return
        const ctrlKeyHeld = evt.detail.endEvent.ctrlKey
        raycaster.setFromCamera(pointer, camera)
        const intersects = raycaster.intersectObjects(scene.children)
            .filter(i => i.object.userData.isSelectable)
        if (ctrlKeyHeld) {
            if (intersects.length) {
                selectedObjects.push(intersects[0])
            }
        } else {
            selectedObjects.length = 0
            if (intersects.length) {
                selectedObjects.push(intersects[0])
            } 
        }

        scene.traverse(element => {
            if (element?.material?.wireframe) {
                element.material.wireframe = false
            }
        })
        selectedObjects.forEach(intersection => {
            intersection.object.material.wireframe = true
        })
        console.log(selectedObjects)
    }
    domElement.addEventListener('stationaryClick', selectObjects)
}