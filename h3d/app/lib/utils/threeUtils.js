/**
 * Returns a list of meshes from a scene by key-value in `userData`.
 * 
 * @param {THREE.Scene} scene - scene to search through
 * @param {string} key - key of userData object
 * @param {any} value - value of userData object
 * @returns {THREE.Mesh[]} - list of descendents in scene matching search criteria.
 */
export function getMeshByUserDataValue(scene, key, value) {
    const meshes = []
  
    scene.traverse((node) => {
        if (node.userData[key] === value) {
            meshes.push(node)
        }
    })
  
    return meshes
}