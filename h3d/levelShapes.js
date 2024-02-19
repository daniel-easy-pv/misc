import * as THREE from 'three'
import { PrismGeometry } from './prism.js'
import { getWalls } from './walls.js'
import { FLOOR_THICKNESS, HEIGHT_ABOVE_GROUND } from './consts.js'

export function getLevel(eTempFloorplan, levelIndex = 0) {
    const group = new THREE.Group()
    const level = eTempFloorplan.levels[levelIndex]
    const rooms = level.rooms || []
    
    for (const room of rooms) {
        const shape = getRoom(room)
        group.add(shape)
    }
    const snappables = getSnappables(level)
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

function getSnappables(level) {
    const group = new THREE.Group()
    const snappableTypes = {
        radiators: {
            color: 0xCC5500,
            specular: 0xff0000,
            transparent: true, 
            opacity: 0.8,
        },
    }
    for (const [snappableType, properties] of Object.entries(snappableTypes)) {
        const snappableGroup = new THREE.Group()
        const snappables = level[snappableType]
        for (const snappable of snappables) {
            const { h, points } = snappable
            const r = snappable.rotation || 0
            const points2 = []
            for (let i = 0; i < points.length; i += 2) {
                points2.push(new THREE.Vector2(points[i], points[i + 1]))
            }
            const geometry = new PrismGeometry(points2, h)
            const material = new THREE.MeshPhongMaterial( properties )
            const shape = new THREE.Mesh(geometry, material)
            shape.rotation.z = Math.PI / 180 * r
            shape.position.z = HEIGHT_ABOVE_GROUND[snappableType]
            shape.userData.slateClass = 'Radiator'
            shape.userData.slateId = snappable.slateId
            snappableGroup.add(shape)
        }
        group.add(snappableGroup)
    }
    return group
}

