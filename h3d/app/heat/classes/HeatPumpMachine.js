import * as THREE from 'three'
import { Cuboid } from '../../lib/classes/Cuboid'

export class HeatPumpMachine extends Cuboid {
    constructor({ ...stuff } = {}) {
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0xbbbbbb,
            specular: 0xffffff,
            transparent: true, 
            opacity: 0.8,
        })
        super({
            bodyMaterial,
            ...stuff })

    }
}