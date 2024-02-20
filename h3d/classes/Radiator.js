import { PrismGeometry } from '../prism'
import * as THREE from 'three'

const VALVE_RADIUS = 20
const VALVE_HEIGHT = 40
const VALVE_OFFSET_Z = 20

export class Radiator {
    constructor(w, d, h) {
        this.w = w
        this.d = d
        this.h = h
    }

    #getBody() {
        const { w, d, h } = this
        const points = [
            new THREE.Vector2(-w / 2, -d / 2),
            new THREE.Vector2(w / 2, -d / 2),
            new THREE.Vector2(w / 2, d / 2),
            new THREE.Vector2(-w / 2, d / 2),
        ]
        const geometry = new PrismGeometry(points, h)
        const material = new THREE.MeshPhongMaterial({
            color: 0xCC5500,
            specular: 0xff0000,
            transparent: true, 
            opacity: 0.8,
        })
        return new THREE.Mesh(geometry, material)
    }

    #getValve() {
        const geometry = new THREE.CylinderGeometry(VALVE_RADIUS, VALVE_RADIUS, VALVE_HEIGHT)
        const material = new THREE.MeshBasicMaterial({
            color: 0xffff00,
        })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.rotation.y = - Math.PI / 2
        return mesh
    }

    #getValvePositions() {
        const { d, h } = this
        const y = d / 2 + VALVE_HEIGHT / 2
        const z = VALVE_HEIGHT + VALVE_OFFSET_Z
        return [
            new THREE.Vector3(0, -y, z),
            new THREE.Vector3(0, y, z),
            new THREE.Vector3(0, y, h - z),
            new THREE.Vector3(0, -y, h - z),
        ]
    }

    getMesh() {
        const group = new THREE.Group()
        const radiator = this.#getBody()
        group.add(radiator)
        for (const position of this.#getValvePositions()) {
            const valve = this.#getValve()
            valve.position.copy(position)
            valve.userData.isPipeEntry = true
            group.add(valve)
        }
        return group
    }
}