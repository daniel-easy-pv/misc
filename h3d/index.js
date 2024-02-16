import { Heat3DModel } from './appHeat3d.js'
import { eTempFloorplan } from './levelSample.js'
import { preprocess } from './preprocess.js'
window.eTempFloorplan = eTempFloorplan
console.log(eTempFloorplan)
console.log(preprocess(eTempFloorplan))
window.h3d = new Heat3DModel('temp-heat-3d', eTempFloorplan)