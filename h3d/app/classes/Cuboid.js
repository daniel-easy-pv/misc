import { PrismGeometry } from '../utils/prism'
import * as THREE from 'three'
import { Valve } from './Valve'

const VALVE_RADIUS = 20
const VALVE_HEIGHT = 40
const VALVE_OFFSET_Z = 20

export class Cuboid {
    constructor({ w, d, h, bodyMaterial } = {}) {
        this.w = w
        this.d = d
        this.h = h
        this.bodyMaterial = bodyMaterial
    }

    getBody() {
        const { w, d, h, bodyMaterial } = this
        const points = [
            new THREE.Vector2(-w / 2, -d / 2),
            new THREE.Vector2(w / 2, -d / 2),
            new THREE.Vector2(w / 2, d / 2),
            new THREE.Vector2(-w / 2, d / 2),
        ]
        const geometry = new PrismGeometry(points, h)
        return new THREE.Mesh(geometry, bodyMaterial)
    }

    #getValve() {
        return new Valve(VALVE_RADIUS, VALVE_HEIGHT).getMesh()
    }

    #getValvePositionsAndRotations() {
        const { d, h } = this
        const y = d / 2
        const z = VALVE_HEIGHT + VALVE_OFFSET_Z
        return [
            {
                position: new THREE.Vector3(0, -y, z),
                rotation: [
                    {
                        axis: new THREE.Vector3(1, 0, 0),
                        radians: Math.PI,
                    }
                ]
            },
            {
                position: new THREE.Vector3(0, y, z),
                rotation: [
                ]
            },
            {
                position: new THREE.Vector3(0, y, h - z),
                rotation: [
                ]
            },
            {
                position: new THREE.Vector3(0, -y, h - z),
                rotation: [
                    {
                        axis: new THREE.Vector3(1, 0, 0),
                        radians: Math.PI,
                    }
                ]
            },
        ]
    }

    getMesh() {
        const group = new THREE.Group()
        const body = this.getBody()
        group.add(body)
        for (const { position, rotation } of this.#getValvePositionsAndRotations()) {
            const valve = this.#getValve()
            for (const { axis, radians } of rotation || []) {
                valve.rotateOnAxis(axis, radians)
            }
            valve.position.copy(position)
            valve.userData.isPipeEntry = true
            valve.userData.isValve = true
            group.add(valve)
        }
        return group
    }
}