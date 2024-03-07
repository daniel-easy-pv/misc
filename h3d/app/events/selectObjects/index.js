import * as THREE from 'three'
import { AppModes } from '../h3dModes.js'

/**
 * A function that adds pipe run listeners to a canvas
 * 
 * @param {import('../../appHeat3d.js').Heat3DModel} app 
 */
export function addSelectObjectsListener(app) {
    const selectedObjects = []
    const raycaster = new THREE.Raycaster()
    const selectObjectSettings = {
        selectedObjects,
        raycaster,
    }

    addSelectMultipleObjectsListener(app, selectObjectSettings)
}

/**
 * A function that adds pipe run listeners to a canvas
 * 
 * @param {import('../../appHeat3d.js').Heat3DModel} app 
 * @param {object} selectObjectSettings
 */
function addSelectMultipleObjectsListener(app, selectObjectSettings) {
    const {
        domElement,
        threeElements,
    } = app
    const {
        pointer,
        camera,
        scene,
    } = threeElements
    
    const {
        selectedObjects,
        raycaster,
    } = selectObjectSettings


    /**
     * Selects a 3D object if clicked in View mode. 
     * Multiple objects can be selected by holding the `Ctrl` key.
     * 
     * @param {CustomEvent<import('../h3dMouseListeners.js').StationaryClickEventDetails>} evt 
     * @returns 
     */
    function selectObjects(evt) {
        if (app.mode !== AppModes.View) return
        const ctrlKeyHeld = evt.detail.endEvent.ctrlKey
        raycaster.setFromCamera(pointer, camera)
        const intersects = raycaster.intersectObjects( scene.children )
        if (intersects.length) {
            if (!ctrlKeyHeld) {
                selectedObjects.length = 0
            }
            selectedObjects.push(intersects[0])
        }
        scene.traverse(element => {
            if (element?.material?.wireframe) {
                element.material.wireframe = false
            }
        })
        selectedObjects.forEach(intersection => {
            intersection.object.material.wireframe = true
        })
    }
    domElement.addEventListener('stationaryClick', selectObjects)
}