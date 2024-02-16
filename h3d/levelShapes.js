import * as THREE from 'three'
import { PrismGeometry } from './prism.js'
import { getWalls } from './walls.js'

export function getLevel(eTempFloorplan, levelIndex = 0) {
    const group = new THREE.Group()
    const level = eTempFloorplan.levels[levelIndex]
    const rooms = level.rooms || []
    const ceilingHeight = level.ceilingHeight
    
    // for (const room of rooms) {
    //     const shape = getRoom(room, ceilingHeight)
    //     group.add(shape)
    // }
    const snappables = getSnappables(level)
    group.add(snappables)
    group.add(getWalls(level))
    group.rotation.x = -Math.PI / 2
    return group
}

function getRoom(room, ceilingHeight) {
    const points = []
    for (let i = 0; i < room.points.length; i += 2) {
        points.push(new THREE.Vector2(room.points[i], room.points[i + 1]))
    }
    const geometry = new PrismGeometry(points, room.h || ceilingHeight)
    const material = new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x00ffff, shininess: 20 } )
    const shape = new THREE.Mesh(geometry, material)
    return shape
}

function getSnappables(level) {
    const group = new THREE.Group()
    const snappableTypes = [
        {
            type: 'doors',
            color: 0x5478E4,
            specular: 0x00ffff,
            z: 0,
        },
        {
            type: 'windows',
            color: 0x81D4FA,
            specular: 0xffffff,
            z: 900,
        },
        {
            type: 'radiators',
            color: 0xCC5500,
            specular: 0xff0000,
            z: 200,
        },
    ]
    for (const snappableType of snappableTypes) {
        const { type, color, specular, z } = snappableType
        const snappableGroup = new THREE.Group()
        const snappables = level[type]
        for (const snappable of snappables) {
            const { h, points } = snappable
            const r = snappable.rotation || 0
            const points2 = []
            for (let i = 0; i < points.length; i += 2) {
                points2.push(new THREE.Vector2(points[i], points[i + 1]))
            }
            const geometry = new PrismGeometry(points2, h)
            const material = new THREE.MeshPhongMaterial( { color, specular, shininess: 20 } )
            const shape = new THREE.Mesh(geometry, material)
            shape.rotation.z = Math.PI / 180 * r
            shape.position.z = z
            snappableGroup.add(shape)
        }
        group.add(snappableGroup)
    }
    return group
}

