import * as THREE from 'three'
import { PrismGeometry } from './prism.js'
import { getWalls } from './walls.js'
import { FLOOR_THICKNESS, HEIGHT_ABOVE_GROUND } from './consts.js'
import { getRectangleProperties } from './preprocess.js'
import { Radiator } from './classes/Radiator.js'

export function getLevel(eTempFloorplan, levelIndex = 0) {
    const group = new THREE.Group()
    const level = eTempFloorplan.levels[levelIndex]
    const rooms = level.rooms || []
    
    for (const room of rooms) {
        const shape = getRoom(room)
        group.add(shape)
    }
    const snappables = getRadiators(level)
    group.add(snappables)
    group.add(getWalls(level))
    return group
}

function getRoom(room) {
    const points = []
    for (let i = 0; i < room.points.length; i += 2) {
        points.push(new THREE.Vector2(room.points[i], room.points[i + 1]))
    }
    const geometry = new PrismGeometry(points, FLOOR_THICKNESS)
    const material = new THREE.MeshBasicMaterial( { color: 0xeeeeee } )
    const shape = new THREE.Mesh(geometry, material)
    shape.position.z = - FLOOR_THICKNESS
    return shape
}

function getRadiators(level) {
    const group = new THREE.Group()
    const snappableType = 'radiators'
    const snappables = level[snappableType]
    for (const snappable of snappables) {
        const { h, points } = snappable
        const { d, w, x, y, rotation } = getRectangleProperties(points)
        const z = HEIGHT_ABOVE_GROUND[snappableType]
        const r = -Math.PI / 180 * rotation
        const shape = new Radiator(w, d, h).getMesh()
        shape.rotation.z = r
        shape.position.set(x, y, z)
        shape.userData.slateClass = 'Radiator'
        shape.userData.slateId = snappable.slateId
        group.add(shape)
    }
    return group
}

