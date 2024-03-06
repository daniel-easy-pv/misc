import { get3Frame } from '.'
import { getValvePositions } from './valveFinder'


export function pipeSnapRuleValve(app, anchor, euler, target3, closestAxisIndex) {
    const RULE_2_THRESHOLD = 100
    
    const axis = get3Frame(euler)[closestAxisIndex]
    
    const valves = getValvePositions(app)
    const valveProjections = valves. map(valveData => {
        const { valvePosition } = valveData
        const projectionLength = valvePosition.clone().sub(anchor).dot(axis)
        const valveProjection = axis.clone().multiplyScalar(projectionLength).add(anchor)
        return {
            valveProjection,
            ...valveData,
        }
    })

    const valveSnap = (valveProjection) => {
        return valveProjection.clone().sub(target3).length() < RULE_2_THRESHOLD
    }

    const closestValveProjection = valveProjections.find(valveData => valveSnap(valveData.valveProjection))
    const uiChangeRule2Success = () => {
        for (const valveData of valveProjections) {
            const { valveProjection, valve } = valveData
            if (valveSnap(valveProjection)) {
                valve.material.color.setHex(0xff0000)
            } else {
                valve.material.color.setHex(0xffff00)
            }
        }
    }
    const uiChangeRule2Failure = () => {
        for (const valveData of valveProjections) {
            const { valve } = valveData
            valve.material.color.setHex(0xffff00)
        }
    }
    if (closestValveProjection) {
        const snapPoint = closestValveProjection.valveProjection
        return {
            ok: true,
            value: snapPoint,
            callback: uiChangeRule2Success,
        }
    } else {
        return {
            ok: false,
            callback: uiChangeRule2Failure,
        }
    }
}