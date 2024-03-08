import * as THREE from 'three'
/**
 * Generates and returns a blank object containing settings for selecting objects.
 *
 * @function
 * @property {THREE.Mesh[]} selectedObjects - An array to store selected objects.
 * @property {THREE.Raycaster} raycaster - An instance of THREE.Raycaster for raycasting.
 * @returns {SelectedObjectsSettings} An object with settings for selecting objects.
 */
export function initSelectedObjectsSettings() {
    const selectedObjects = []
    const raycaster = new THREE.Raycaster()
    return {
        raycaster,
        selectedObjects,
    }
}

/**
 * @typedef {Object} SelectedObjectsSettings
 * @property {THREE.Raycaster} raycaster
 * @property {Intersection<Object3D<Object3DEventMap>>[]} selectedObjects
 */