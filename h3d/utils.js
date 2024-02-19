export const getMeshByUserDataValue = (scene, name, value) => {
    const meshes = []
  
    scene.traverse((node) => {
        if (node.userData[name] === value) {
            meshes.push(node)
        }
    })
  
    return meshes
}