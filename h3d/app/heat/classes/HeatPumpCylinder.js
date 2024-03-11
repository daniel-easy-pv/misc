import * as THREE from 'three'
import { Valve } from '../../lib/classes/Valve'
import { materialConfig } from '../../materials/materials.js'

const VALVE_RADIUS = 20
const VALVE_HEIGHT = 40

export class HeatPumpCylinder {
    constructor(r, h) {
        this.r = r
        this.h = h
    }

    #getBody() {
        const { r, h } = this
        const geometry = new THREE.CylinderGeometry(r, r, h)
        const m = materialConfig.heatPumpCylinderMaterial
        const material = new THREE.MeshPhongMaterial(m.original)
        const mesh = new THREE.Mesh(geometry, material)
        mesh.rotation.x = - Math.PI / 2
        mesh.position.z = h / 2
        mesh.userData.materialConfig = m
        return mesh
    }

    #getValve() {
        const mesh = new Valve(VALVE_RADIUS, VALVE_HEIGHT).getMesh()
        mesh.rotation.x = Math.PI / 2
        mesh.position.z = VALVE_HEIGHT / 2
        return mesh
    }

    #getValvePositionsAndRotations() {
        const { r, h } = this
        const y = r
        const z = h / 4 
        return [
            {
                position: new THREE.Vector3(0, -y, z),
                rotation: [{
                    axis: new THREE.Vector3(1, 0, 0),
                    radians: Math.PI / 2,
                }],
            },
            {
                position: new THREE.Vector3(0, y, z),
                rotation: [{
                    axis: new THREE.Vector3(1, 0, 0),
                    radians: -Math.PI / 2,
                }],
            },
            {
                position: new THREE.Vector3(-y, 0, z),
                rotation: [{
                    axis: new THREE.Vector3(0, 0, 1),
                    radians: Math.PI / 2,
                }],
            },
            {
                position: new THREE.Vector3(y, 0, z),
                rotation: [{
                    axis: new THREE.Vector3(0, 0, 1),
                    radians: -Math.PI / 2,
                }],
            },
            {
                position: new THREE.Vector3(0, 0, h),
                rotation: [],
            }
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
            valve.userData.isValve = true
            group.add(valve)
        }
        return group
    }
}