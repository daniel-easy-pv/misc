import * as THREE from 'three'
import { getMeshByUserDataValue } from '../../utils'

export function getValvePositions(app) {
    const {
        threeElements,
    } = app
    const {
        scene,
    } = threeElements
    const valves = getMeshByUserDataValue(scene, 'isValve', true)
        .map(valve => {
            const valvePosition = valve.getWorldPosition(new THREE.Vector3())
            return {
                valve,
                valvePosition,
            }
        })
    return valves
}