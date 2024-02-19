import * as THREE from 'three'
import { PrismGeometry } from './prism.js'
import { CSG } from 'three-csg-ts'
import { getRectangleProperties } from './preprocess.js'
import { HEIGHT_ABOVE_GROUND } from './consts.js'

const wallDict = {
    internal: {
        color: 0x000000,
    },
    external: {
        color: 0x000000,
    }
}

export function getWalls(level) {
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
        const material = new THREE.MeshBasicMaterial( { 
            ...wallDict[externality], 
            opacity: 0.1,
            transparent: true,
        })
        const wallWithoutHoles = new THREE.Mesh(geometry, material)
        wallWithoutHoles.position.x = position.x
        wallWithoutHoles.position.y = position.y
        wallWithoutHoles.rotation.z = Math.PI / 180 * rotation
        const holes = getHoles(neighbours, { wallThickness: width })
        let wallWithHoles = wallWithoutHoles
        for (const hole of holes) {
            wallWithHoles.updateMatrix()
            hole.updateMatrix()
            wallWithHoles = CSG.subtract(wallWithHoles, hole)
        }
        group.add(wallWithHoles)
    }
    return group
}

function heightOfRoom(level, roomIndexInLevel) {
    return level.rooms[roomIndexInLevel].h || level.ceilingHeight
}

function getHoles(neighbours, {
    wallThickness,
}) {
    const meshes = []
    for (const neighbour of neighbours) {
        for (const snappableType of Object.keys(neighbour).filter(type => ['windows', 'doors'].includes(type))) {
            for (const snappable of neighbour[snappableType]) {
                const { d, w, x, y, rotation } = getRectangleProperties(snappable.points)
                const z = HEIGHT_ABOVE_GROUND[snappableType]
                const t = wallThickness ? wallThickness : w
                const THICKNESS_EXTENSION = 100
                const snappablePoints = [
                    new THREE.Vector2(-w/2 - THICKNESS_EXTENSION, -d / 2),
                    new THREE.Vector2(t - w / 2 + THICKNESS_EXTENSION, -d / 2),
                    new THREE.Vector2(t - w / 2 + THICKNESS_EXTENSION, d / 2),
                    new THREE.Vector2(-w/2 - THICKNESS_EXTENSION, d / 2),
                ]
                const h = snappable.h
                const geometry = new PrismGeometry(snappablePoints, h)
                const material = new THREE.MeshBasicMaterial()
                const mesh = new THREE.Mesh(geometry, material)
                mesh.position.set(x, y, z)
                mesh.rotation.z = Math.PI / 180 * rotation
                meshes.push(mesh)
            }
        }
    }
    return meshes
}

