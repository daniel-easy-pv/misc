import { get3Frame } from './index.js'
import { changeMaterialEmphasis } from '../../materials/index.js'
import { getValvePositions } from './valveFinder.js'

const PIPE_SNAP_RULE_INTERSECT_VALVE = 100

/**
 * Returns the 3D position of the intersection (or near the intersection for a wall).
 * 
 * @param {import('../../appHeat3d.js').Heat3DModel} app 
 * @param {THREE.Vector3} target3 - the 3D coordinate that the mouse is pointing at
 * @param {number} closestAxisIndex - the index of the axis the temporary pipe leg is running along
 */
export function pipeSnapRuleValve(app, target3, closestAxisIndex) {
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
    if (closestValves.length) {
        const snapPoint = closestValves[0].valveProjection
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