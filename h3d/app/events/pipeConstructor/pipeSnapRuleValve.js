import { get3Frame } from '.'
import { PIPE_SNAP_RULE_INTERSECT_VALVE } from '../../consts'
import { changeMaterialEmphasis } from '../../materials'
import { getValvePositions } from './valveFinder'


export function pipeSnapRuleValve(app, pipeListenerSettings, target3, closestAxisIndex) {
    const {
        anchors,
        euler,
    } = pipeListenerSettings
    const anchor = anchors[anchors.length - 1]
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
        return valveProjection.clone().sub(target3).length() <= PIPE_SNAP_RULE_INTERSECT_VALVE
    }

    const closestValveProjection = valveProjections.find(valveData => valveSnap(valveData.valveProjection))
    const uiChangeRule2Success = () => {
        for (const valveData of valveProjections) {
            const { valveProjection, valve } = valveData
            const emphasis = valveSnap(valveProjection) ? 'highlighted' : 'original'
            changeMaterialEmphasis(emphasis, valve)
        }
    }
    const uiChangeRule2Failure = () => {
        for (const valveData of valveProjections) {
            const { valve } = valveData
            changeMaterialEmphasis('original', valve)
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