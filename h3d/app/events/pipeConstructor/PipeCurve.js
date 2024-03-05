import * as THREE from 'three'
export class PipeCurve extends THREE.Curve {
    constructor(arr) {
        super()
        this.arr = arr
    }

    static Material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        specular: 0xffa8a8,
        color: 0xb87333,
        shininess: 30,
    })

    getPoint(t, optionalTarget = new THREE.Vector3()) {
        const p0 = this.arr[0]
        const p1 = this.arr[1]
        const tx = (1-t) * p0.x + t * p1.x
        const ty = (1-t) * p0.y + t * p1.y
        const tz = (1-t) * p0.z + t * p1.z
        return optionalTarget.set(tx, ty, tz)
    } 
}