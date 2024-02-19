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

    toPixels(vector) {
        const v = new THREE.Vector3().copy(vector)
        v.project(this.camera)
        const navOffset = document.querySelector('nav')?.offsetHeight ?? 0
        const vx = (v.x + 1) * this.domElement.offsetWidth / 2 + this.domElement.offsetLeft
        const vy = -(v.y - 1) * this.domElement.offsetHeight / 2 + this.domElement.offsetTop + navOffset
        return new THREE.Vector2(vx, vy)
    }
}