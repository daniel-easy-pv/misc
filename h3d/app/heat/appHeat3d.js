import { getBarycenter, preprocess } from './preprocess.js'
import { TrailCreator } from '../lib/appTrailCreator.js'
import { getLevel } from './levelShapes.js'

/**
 * @typedef {object} ETempFloorplan - this should be be passed in from Heatpunk as
     * `e.floorplan.converter.getNew(e.store.floorplan, {
            points: 'layer',
            bigStructure: 'seperated',
            materials: 'materialIDs',
            areas: 'excluded',
            heatLoss: 'excluded',
            walls: 'included',
            partitionsInRooms: 'included', // walls need to know about windows and doors
            radiatorOutputs: 'excluded',
        }, { existingConfig: e.floorplan.defaultStoreStructures.storeStore })`
    @property {object[]} levels
 */

/**
 * A class containing all the information needed to display the 3D Floorplan in Heatpunk.
 */
export class Heat3DModel extends TrailCreator {
    /**
     * 
     * @param {string} domElementName 
     * @param {ETempFloorplan} eTempFloorplan 
     */
    constructor(
        domElementName,
        eTempFloorplan,
    ) {
        const data = preprocess(eTempFloorplan)
        const barycenter = getBarycenter(eTempFloorplan)
        super(domElementName, data, barycenter)
        const {
            scene
        } = this.threeElements
        scene.add(getLevel(data))
    }
}

