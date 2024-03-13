import * as THREE from 'three'
import { getMeshByUserDataValue } from '../../utils/threeUtils.js'
import { Heat3DModel } from '../../../heat/appHeat3d.js'

export function getValvePositions(app: Heat3DModel) {
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