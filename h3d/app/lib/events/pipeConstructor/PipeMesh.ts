import * as THREE from 'three'
import { PipeMaterial } from '../../../materials/PipeMaterial'
import { recordConstructorParameters } from '../../database/databaseMixin'
class PipeCurve extends THREE.Curve<THREE.Vector3> {
    arr: THREE.Vector3[]
    constructor(arr: THREE.Vector3[]) {
        super()
        this.arr = arr
    }

    getPoint(t: number, optionalTarget = new THREE.Vector3()) {
        const p0 = this.arr[0]
        const p1 = this.arr[1]
        const tx = (1-t) * p0.x + t * p1.x
        const ty = (1-t) * p0.y + t * p1.y
        const tz = (1-t) * p0.z + t * p1.z
        return optionalTarget.set(tx, ty, tz)
    } 
}

class PipeLegGeometry extends THREE.TubeGeometry {
    constructor(path: THREE.Curve<THREE.Vector3>, radius: number) {
        const tubularSegments = 20
        const radialSegments = 8
        const closed = false
        super(path, tubularSegments, radius, radialSegments, closed)
    }
}

function newPipeMaterial(pipeMaterial: PipeMaterial) {
    if (pipeMaterial === PipeMaterial.Copper) {
        return new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            specular: 0xffa8a8,
            color: 0xb87333,
            shininess: 30,
        })
    } else if (pipeMaterial === PipeMaterial.Plastic) {
        return new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            color: 0xffffff,
        })
    } else {
        return new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            color: 0xff0000,
        })
    }
}

type Array3 = [number, number, number]
interface PipeMeshParameters {
    start: Array3
    end: Array3
    diameter: number
    pipeMaterialName: string
}

export class PipeMesh extends THREE.Mesh {
    constructor(constructorParameters: PipeMeshParameters) {
        const {start, end, diameter, pipeMaterialName} = constructorParameters
        const start3 = new THREE.Vector3(...start)
        const end3 = new THREE.Vector3(...end)
        const path = new PipeCurve([start3, end3])
        const radius = diameter / 2
        const geometry = new PipeLegGeometry(path, radius)
        const material = newPipeMaterial(PipeMaterial[pipeMaterialName])
        super(geometry, material)
        this.userData.isSelectable = true
        recordConstructorParameters(this, constructorParameters)
    }

    /**
     * Returns the diameter of the pipe.
     */
    getDiameter(): number {
        const { diameter } = this.userData.constructorParameters
        return Number(diameter)
    }

    /**
     * Returns the pipe material name.
     */
    getPipeMaterialName(): string {
        return this.userData.constructorParameters.pipeMaterialName
    }

    /**
     * Returns the start of the pipe as type THREE.Vector3.
     */
    getStart(): THREE.Vector3 {
        return new THREE.Vector3(...this.userData.constructorParameters.start)
    }

    /**
     * Returns the end of the pipe as type THREE.Vector3.
     */
    getEnd(): THREE.Vector3 {
        return new THREE.Vector3(...this.userData.constructorParameters.end)
    }

    /**
     * Sets the diameter of the pipe.
     */
    setDiameter(newDiameter: number) {
        const start = this.getStart()
        const end = this.getEnd()
        const radius = newDiameter / 2
        const path = new PipeCurve([start, end])
        this.geometry.dispose()
        this.geometry = new PipeLegGeometry(path, radius)
        this.userData.constructorParameters.diameter = newDiameter
    }
}

/**
 * According to CIBSE, these are the diameters of pipes (in mm) with entries in their data tables.
 */
export const allowedPipeDiametersByMaterial = {
    Copper: [
        8, 10, 15, 22, 28, 35, 42, 54, 67, 76, 108,
    ],
    Plastic: [
        10, 12, 15, 16, 18, 20, 22, 25, 28, 32, 40, 50, 63, 75, 90, 110,
    ]
}
