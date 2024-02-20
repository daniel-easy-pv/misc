import * as THREE from 'three'

export class ScreenPosition {
    constructor(domElement, camera) {
        this.domElement = domElement
        this.camera = camera
    }

    toNormalized(vector) {
        const v = new THREE.Vector3().copy(vector)
        v.project(this.camera)
        return [v.x, v.y]
    }

    /**
     * 
     * @param {THREE.Vector3} vector 
     * @returns {THREE.Vector2} Returns in px the position on screen of a 3-vector relative to parent
     */
    toPixels(vector) {
        const v = new THREE.Vector3().copy(vector)
        v.project(this.camera)
        const navOffset = document.querySelector('nav')?.offsetHeight ?? 0
        const vx = (v.x + 1) * this.domElement.offsetWidth / 2
        const vy = -(v.y - 1) * this.domElement.offsetHeight / 2 + navOffset
        return new THREE.Vector2(vx, vy)
    }
}