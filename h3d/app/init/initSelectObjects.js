import * as THREE from 'three'
/**
 * Generates and returns a blank object containing settings for selecting objects.
 *
 * @function
 * @returns {Object} An object with settings for selecting objects.
 * @property {THREE.Mesh[]} selectedObjects - An array to store selected objects.
 * @property {THREE.Raycaster} raycaster - An instance of THREE.Raycaster for raycasting.
 */
export function initSelectedObjectsSettings() {
    const selectedObjects = []
    const raycaster = new THREE.Raycaster()
    return {
        selectedObjects,
        raycaster,
    }
}