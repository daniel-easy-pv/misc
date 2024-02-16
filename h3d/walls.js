import * as THREE from 'three'
import { PrismGeometry } from './prism.js'

export function getWalls(level) {
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
        const h = Math.max(...neighbours.map(n => heightOfRoom(level, n.roomIndexInLevel)))
        const geometry = new PrismGeometry(points, h)
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

function heightOfRoom(level, roomIndexInLevel) {
    return level.rooms[roomIndexInLevel].h || level.ceilingHeight
}