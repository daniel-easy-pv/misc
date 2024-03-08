import * as THREE from 'three'
import { PipeMaterial } from '../../materials/PipeMaterial'
class PipeCurve extends THREE.Curve {
    constructor(arr) {
        super()
        this.arr = arr
    }

    getPoint(t, optionalTarget = new THREE.Vector3()) {
        const p0 = this.arr[0]
        const p1 = this.arr[1]
        const tx = (1-t) * p0.x + t * p1.x
        const ty = (1-t) * p0.y + t * p1.y
        const tz = (1-t) * p0.z + t * p1.z
        return optionalTarget.set(tx, ty, tz)
    } 
}

class PipeLegGeometry extends THREE.TubeGeometry {
    constructor(path, radius) {
        const tubularSegments = 20
        const radialSegments = 8
        const closed = false
        super(path, tubularSegments, radius, radialSegments, closed)
    }
}

export class PipeMesh extends THREE.Mesh {
    /**
     * 
     * @param {THREE.Vector3} start - start coordinate of pipe
     * @param {THREE.Vector3} end - end coordinate of pipe
     * @param {number} diameter - diameter of the pipe
     * @param {THREE.Material} material - material of pipe
     */
    constructor(start, end, diameter, material) {
        const path = new PipeCurve([start, end])
        const radius = diameter / 2
        const geometry = new PipeLegGeometry(path, radius)
        super(geometry, material)
        Object.assign(this.userData, {
            eStorePipes: {
                start,
                end,
                diameter,
            },
            isSelectable: true,
        })
    }

    /**
     * Returns the diameter of the pipe.
     * 
     * @returns {number}
     */
    getDiameter() {
        const { diameter } = this.userData.eStorePipes
        return Number(diameter)
    }

    /**
     * Sets the diameter of the pipe.
     * 
     * @param {number} newDiameter 
     */
    setDiameter(newDiameter) {
        const { 
            start,
            end,
        } = this.userData.eStorePipes
        const radius = newDiameter / 2
        const path = new PipeCurve([start, end])
        this.geometry.dispose()
        this.geometry = new PipeLegGeometry(path, radius)
        this.userData.eStorePipes.diameter = newDiameter
    }
}

export class CopperPipeMesh extends PipeMesh {
    constructor(start, end, diameter) {
        const material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            specular: 0xffa8a8,
            color: 0xb87333,
            shininess: 30,
        })
        super(start, end, diameter, material)
    }
}

export class PlasticPipeMesh extends PipeMesh {
    constructor(start, end, diameter) {
        const material = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            color: 0xffffff,
        })
        super(start, end, diameter, material)
    }
}

export class PipeMeshFactory {
    /**
     * Creates a factory that builds pipes of a given setting.
     * 
     * @param {THREE.Vector3} start 
     * @param {THREE.Vector3} end 
     * @param {number} diameter 
     * @param {PipeMaterial} material 
     */
    constructor(start, end, diameter, material) {
        this.start = start
        this.end = end
        this.diameter = diameter
        this.material = material
    }

    /**
     * Builds a pipe given the configurations.
     * 
     * @returns 
     */
    build() {
        const {
            start, 
            end,
            diameter,
            material,
        } = this
        if (material === PipeMaterial.Copper) {
            return new CopperPipeMesh(start, end, diameter)
        } else {
            return new PlasticPipeMesh(start, end, diameter)
        }
    }
}