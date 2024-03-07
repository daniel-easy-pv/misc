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


    function singleClickToSelect() {
        if (app.mode !== AppModes.View) return
        raycaster.setFromCamera(pointer, camera)
        const intersects = raycaster.intersectObjects( scene.children )
        if (intersects.length) {
            selectedObjects.length = 0
            selectedObjects.push(intersects[0])
        }
        console.log(selectedObjects)
        selectedObjects.forEach(intersection => {
            intersection.object.material.wireframe = true
        })
    }
    domElement.addEventListener('stationaryClick', singleClickToSelect)
}