import * as THREE from 'three'
import { PrismGeometry } from './prism.js'

export function getLevel(eTempFloorplan, levelIndex = 0) {
    const group = new THREE.Group()
    const level = eTempFloorplan.levels[levelIndex]
    const rooms = level.rooms || []
    const ceilingHeight = level.ceilingHeight
    
    for (const room of rooms) {
        const shape = getRoom(room, ceilingHeight)
        group.add(shape)
    }
    const snappables = getSnappables(level)
    group.add(snappables)
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
        },
        {
            type: 'windows',
            color: 0x81D4FA,
            specular: 0xffffff,
        },
        {
            type: 'radiators',
            color: 0xCC5500,
            specular: 0xff0000,
        }
    ]
    for (const snappableType of snappableTypes) {
        const { type, color, specular } = snappableType
        const snappableGroup = new THREE.Group()
        const snappables = level[type]
        for (const snappable of snappables) {
            const { h, height, width, position } = snappable
            const d = height
            const w = width
            const { x, y } = position
            const r = snappable.rotation || 0
            const points = [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(w, 0),
                new THREE.Vector2(w, -d),
                new THREE.Vector2(0, -d),
            ]
            const geometry = new PrismGeometry(points, h)
            const material = new THREE.MeshPhongMaterial( { color, specular, shininess: 20 } )
            const shape = new THREE.Mesh(geometry, material)
            shape.rotation.z = Math.PI / 180 * r
            shape.position.x = x
            shape.position.y = y
            snappableGroup.add(shape)
        }
        group.add(snappableGroup)
    }
    return group
}
