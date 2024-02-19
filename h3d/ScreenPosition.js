export class ScreenPosition {
    constructor(domElement, camera) {
        this.domElement = domElement
        this.camera = camera
    }

    #project(vector) {
        vector.project(this.camera)
    }

    toNormalized(vector) {
        this.#project(vector)
        return [vector.x, vector.y]
    }

    toPixels(vector) {
        this.#project(vector)
        const vx = (vector.x + 1) * this.domElement.offsetWidth / 2
        const vy = -(vector.y - 1) * this.domElement.offsetHeight / 2
        return [vx, vy]
    }
}