import * as THREE from 'three'

export class Valve {
    constructor(r, h, {
        color = 0x000000,
    } = {}) {
        this.r = r
        this.h = h
        this.color = color
    }

    getMesh() {
        const { r, h, color } = this
        const geometry = new THREE.CylinderGeometry(r, r, h).translate(0, h / 2, 0)
        const material = new THREE.MeshBasicMaterial({
            color,
        })
        const mesh = new THREE.Mesh(geometry, material)
        return mesh
    }
}