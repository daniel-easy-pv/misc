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

        const holes = getHoles(neighbours, { wallThickness: width })
        group.add(holes)
        const geometry = new PrismGeometry(points, h)
        const material = new THREE.MeshPhongMaterial( { 
            ...wallDict[externality], 
            opacity: 0.7,
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

function getHoles(neighbours, {
    wallThickness,
}) {
    const holeGroup = new THREE.Group()
    for (const neighbour of neighbours) {
        for (const snappable of (neighbour.windows || []).concat(neighbour.doors || [])) {
            const { d, w, position, rotation } = snappable.rectangleHole
            const t = wallThickness ? wallThickness : w
            const THICKNESS_EXTENSION = 100
            const snappablePoints = [
                new THREE.Vector2(-w/2 - THICKNESS_EXTENSION, -d / 2),
                new THREE.Vector2(t - w / 2 + THICKNESS_EXTENSION, -d / 2),
                new THREE.Vector2(t - w / 2 + THICKNESS_EXTENSION, d / 2),
                new THREE.Vector2(-w/2 - THICKNESS_EXTENSION, d / 2),
            ]
            const h = snappable.h
            const snappableGeometry = new PrismGeometry(snappablePoints, h)
            const snappableMaterial = new THREE.MeshPhongMaterial({
                color: 'cyan',
                specular: 0xffffff,
                shininess: 20,
            })
            const snappableShape = new THREE.Mesh(snappableGeometry, snappableMaterial)
            snappableShape.position.set(...Object.values(position))
            snappableShape.rotation.z = Math.PI / 180 * rotation
            holeGroup.add(snappableShape)
        }
    }
    return holeGroup
}

