import { Heat3DModel } from '../../../heat/appHeat3d.ts'
import { changeMaterialEmphasis } from '../../../materials/materials.js'
import { get3Frame } from './addPipeListener.js'
import { getValvePositions } from './valveFinder.ts'

const PIPE_SNAP_RULE_INTERSECT_VALVE = 100

/**
 * Returns the 3D position of the intersection (or near the intersection for a wall).
 */
export function pipeSnapRuleValve(app: Heat3DModel, target3: THREE.Vector3, closestAxisIndex: number) {
    const {
        pipeListenerSettings,
    } = app
    const {
        anchors,
        euler,
    } = pipeListenerSettings
    const anchor = anchors[anchors.length - 1]
    const axis = get3Frame(euler)[closestAxisIndex]
    
    const valves = getValvePositions(app)
    const projections = valves. map(valveData => {
        const { valvePosition } = valveData
        const projectionLength = valvePosition.clone().sub(anchor).dot(axis)
        const valveProjection = axis.clone().multiplyScalar(projectionLength).add(anchor)
        const distance = valveProjection.clone().sub(target3).length()
        return {
            valveProjection,
            distance,
            ...valveData,
        }
    })

    const closestDistance = Math.min(...projections.map(p => p.distance))
    const isClosest = (projection) => {
        return projection.distance === closestDistance && closestDistance <= PIPE_SNAP_RULE_INTERSECT_VALVE
    }

    const closestValves = projections.filter(isClosest)
    const uiChangeRule2Success = () => {
        for (const projection of projections) {
            const { valve } = projection
            const emphasis = isClosest(projection) ? 'highlighted' : 'original'
            changeMaterialEmphasis(emphasis, valve)
        }
    }
    const uiChangeRule2Failure = () => {
        for (const projection of projections) {
            const { valve } = projection
            changeMaterialEmphasis('original', valve)
        }
    }
    const ok = closestValves.length > 0
    const value = closestValves[0]?.valveProjection
    const callback = ok ? uiChangeRule2Success : uiChangeRule2Failure
    return {
        ok,
        value,
        callback,
    }
}