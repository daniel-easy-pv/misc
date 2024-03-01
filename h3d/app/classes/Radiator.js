import { PrismGeometry } from '../prism'
import * as THREE from 'three'
import { Valve } from './Valve'

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
        return new Valve(VALVE_RADIUS, VALVE_HEIGHT, {
            color: 0xffff00,
        }).getMesh()
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
        const body = this.#getBody()
        group.add(body)
        for (const { position, rotation } of this.#getValvePositionsAndRotations()) {
            const valve = this.#getValve()
            for (const { axis, radians } of rotation || []) {
                valve.rotateOnAxis(axis, radians)
            }
            valve.position.copy(position)
            valve.userData.isPipeEntry = true
            group.add(valve)
        }
        return group
    }
}