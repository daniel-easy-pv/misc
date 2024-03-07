import { AppModes } from '../h3dModes.js'

/**
 * A function that adds pipe run listeners to a canvas
 * 
 * @param {import('../../appHeat3d.js').Heat3DModel} app 
 */
export function addSelectObjectsListener(app) {
    const selectedObjects = []
    const selectObjectSettings = {
        selectedObjects,
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
    } = app
    const {
        selectedObjects,
    } = selectObjectSettings

    domElement.addEventListener('stationaryClick', function singleClickToSelect(evt) {
        if (app.mode !== AppModes.View) return
        console.log('selecting object')
    })
}