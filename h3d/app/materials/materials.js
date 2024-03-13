export const materialConfig = {
    wallMaterial: {
        original: {
            color: 0x000000,
            transparent: true,
            opacity: 0.1,
            depthWrite: false,
        },
        highlighted: {
            color: 0x000000,
            transparent: true,
            opacity: 0.3,
        }
    },
    valveMaterial: {
        original: {
            color: 0xffff00,
            transparent: true,
            opacity: 0.8,
        },
        highlighted: {
            color: 0xff0000,
            transparent: true,
            opacity: 0.8,
        }
    },
    heatPumpCylinderMaterial: {
        original: {
            color: 0x556b2f,
            specular: 0xffffff,
            transparent: true, 
            opacity: 0.8,
        },
        highlighted: {
            color: 0x00ff00,
            specular: 0xffffff,
            transparent: true, 
            opacity: 0.8,
        }
    }
}

/**
 * Changes the mesh to be highlighted or original, reading from userData.
 * 
 * @param {'original' | 'highlighted'} emphasis 
 * @param {THREE.Object3D} mesh 
 * @returns 
 */
export function changeMaterialEmphasis(emphasis, mesh) {
    const newMaterialConfig = mesh.userData?.materialConfig?.[emphasis]
    if (!newMaterialConfig) return
    const color = newMaterialConfig.color
    mesh.material.color.setHex(color)
                
    const opacity = newMaterialConfig.opacity
    mesh.material.opacity = opacity
}