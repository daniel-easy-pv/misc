import * as THREE from 'three'
import { Cuboid } from './Cuboid'

export class Radiator extends Cuboid {
    constructor({ ...stuff } = {}) {
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0xCC5500,
            specular: 0xff0000,
            transparent: true, 
            opacity: 0.8,
        })
        super({
            bodyMaterial,
            ...stuff })

    }
}