import * as THREE from 'three'
export const FRUSTUM_SIZE = 15000

export const HEIGHT_ABOVE_GROUND = {
    windows: 900,
    doors: 0,
    radiators: 150,
    heatPumpMachines: 0,
    heatPumpCylinders: 0,
}

export const MESH_COLORS = {
    windows: '#81D4FA',
    doors: '#5478E4',
}

export const FLOOR_THICKNESS = 100

export const MOUSE_ACCURACY_THRESHOLD = 20 // how many pixels within to click on

export const LAYER_MAGENTA_SPHERES = 1

/**
 * @const
 * @type {THREE.Vector3[]}
 * the standard coordinate system
 */
export const UNITS = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 1),
]