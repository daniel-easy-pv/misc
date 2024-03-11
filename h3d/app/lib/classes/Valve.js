import * as THREE from 'three'
import { materialConfig } from '../../materials/materials.js'

export class Valve {
    constructor(r, h) {
        this.r = r
        this.h = h
    }

    getMesh() {
        const { r, h } = this
        const geometry = new THREE.CylinderGeometry(r, r, h).translate(0, h / 2, 0)
        const material = new THREE.MeshBasicMaterial(materialConfig.valveMaterial.original)
        const mesh = new THREE.Mesh(geometry, material)
        mesh.userData.materialConfig = materialConfig.valveMaterial
        return mesh
    }
}