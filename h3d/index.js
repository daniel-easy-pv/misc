import { Heat3DModel } from './app/heat/appHeat3d.js'
import { eTempFloorplan } from './levelSample.js'
import * as THREE from 'three'
window.eTempFloorplan = eTempFloorplan
console.log(eTempFloorplan)
window.h3d = new Heat3DModel('temp-heat-3d', eTempFloorplan)
window.scene = window.h3d.scene
window.THREE = THREE