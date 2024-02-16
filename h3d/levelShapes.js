import * as THREE from 'three'
import { PrismGeometry } from './prism.js'

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
        },
    ]
    for (const snappableType of snappableTypes) {
        const { type, color, specular } = snappableType
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
            snappableGroup.add(shape)
        }
        group.add(snappableGroup)
    }
    return group
}

function getWalls(level) {
    const wallDict = {
        internal: {
            color: 0xcccccc,
            specular: 0xffffff,
        },
        external: {
            color: 0x777777,
            specular: 0xffffff,
        }
    }
    const group = new THREE.Group()
    for (const wall of level.walls || []) {
        const { width, height, rotation, position, neighbours } = wall
        const externality = neighbours.length === 2 ? 'internal' : 'external'
        const points = [
            new THREE.Vector2(0, -height / 2),
            new THREE.Vector2(width, -height / 2),
            new THREE.Vector2(width, height / 2),
            new THREE.Vector2(0, height / 2),
        ]
        const geometry = new PrismGeometry(points, 2000)
        const material = new THREE.MeshPhongMaterial( { 
            ...wallDict[externality], 
            opacity: 0.5,
            transparent: true,
            shininess: 20 
        })
        const shape = new THREE.Mesh(geometry, material)
        shape.position.x = position.x
        shape.position.y = position.y
        shape.rotation.z = Math.PI / 180 * rotation
        group.add(shape)
    }
    return group
}