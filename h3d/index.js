import { Heat3DModel } from './appHeat3d.js'
import { eTempFloorplan } from './levelSample.js'

console.log(eTempFloorplan)
window.h3d = new Heat3DModel('temp-heat-3d', eTempFloorplan)