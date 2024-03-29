import * as THREE from 'three'
import { PrismGeometry } from '../lib/utils/prism.js'
import { CSG } from 'three-csg-ts'
import { getRectangleProperties } from './preprocess.js'
import { HEIGHT_ABOVE_GROUND, MESH_COLORS } from './pipeSizingConsts.js'
import { materialConfig } from '../materials/materials.js'

export function getWalls(level) {
    const group = new THREE.Group()
    for (const wall of level.walls || []) {
        const { width, height, rotation, position, neighbours } = wall
        const points = [
            new THREE.Vector2(0, -height / 2),
            new THREE.Vector2(width, -height / 2),
            new THREE.Vector2(width, height / 2),
            new THREE.Vector2(0, height / 2),
        ]
        const h = Math.max(...neighbours.map(n => heightOfRoom(level, n.roomIndexInLevel)))

        const geometry = new PrismGeometry(points, h)
        const material = new THREE.MeshBasicMaterial(materialConfig.wallMaterial.original)
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
        wallWithHoles.userData.isWall = true
        wallWithHoles.userData.materialConfig = materialConfig.wallMaterial
        group.add(wallWithHoles)

        const apertures = getApertures(neighbours, { wallThickness: width })
        group.add(apertures)
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
                const THICKNESS_EXTENSION = 500
                const snappablePoints = buildCuboid(t + THICKNESS_EXTENSION, d)
                const h = snappable.h
                const geometry = new PrismGeometry(snappablePoints, h)
                const material = new THREE.MeshBasicMaterial()
                const mesh = new THREE.Mesh(geometry, material)
                mesh.rotation.z = -Math.PI / 180 * rotation
                mesh.position.set(x, y - (t - w) / 2, z)
                meshes.push(mesh)
            }
        }
    }
    return meshes
}

function getApertures(neighbours, {
    wallThickness,
}) {
    const meshes = []
    for (const neighbour of neighbours) {
        for (const snappableType of Object.keys(neighbour).filter(type => ['windows', 'doors'].includes(type))) {
            for (const snappable of neighbour[snappableType]) {
                const { d, w, x, y, rotation } = getRectangleProperties(snappable.points)
                const z = HEIGHT_ABOVE_GROUND[snappableType]
                const t = wallThickness ? wallThickness : w
                const THICKNESS_EXTENSION = -Math.max(0, wallThickness - w)
                const snappablePoints = buildCuboid(t + THICKNESS_EXTENSION, d)
                const h = snappable.h
                const geometry = new PrismGeometry(snappablePoints, h)
                const material = new THREE.MeshBasicMaterial({
                    color: MESH_COLORS[snappableType],
                    transparent: true,
                    opacity: 0.3,
                })
                const mesh = new THREE.Mesh(geometry, material)
                mesh.rotation.z = -Math.PI / 180 * rotation
                mesh.position.set(x, y - (t - w) / 2, z)
                meshes.push(mesh)
            }
        }
    }
    const group = new THREE.Group()
    for (const mesh of meshes) {
        group.add(mesh)
    }
    return group
}

function buildCuboid(w, d) {
    return [
        new THREE.Vector2(-w / 2, -d / 2),
        new THREE.Vector2(w / 2, -d / 2),
        new THREE.Vector2(w / 2, d / 2),
        new THREE.Vector2(-w / 2, d / 2),
    ]
}
