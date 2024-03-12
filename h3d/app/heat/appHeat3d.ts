import { getBarycenter, preprocess } from './preprocess.js'
import { TrailCreator } from '../lib/appTrailCreator.ts'
import { getLevel } from './levelShapes.js'

/**
 * this should be be passed in from Heatpunk as
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
 */
interface ETempFloorplan {
    levels: object[]
}

/**
 * A class containing all the information needed to display the 3D Floorplan in Heatpunk.
 */
export class Heat3DModel extends TrailCreator {
    constructor(
        domElementName: string,
        eTempFloorplan: ETempFloorplan,
    ) {
        const data = preprocess(eTempFloorplan)
        const barycenter = getBarycenter(eTempFloorplan)
        super(domElementName, barycenter)
        const {
            scene
        } = this.threeElements
        scene.add(getLevel(data))
    }
}

