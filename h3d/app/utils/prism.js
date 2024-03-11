import * as THREE from 'three'

/**
 * Creates a prism shape, given its polygonal face and height.
 */
export class PrismGeometry extends THREE.ExtrudeGeometry {
    /**
     * 
     * @param {THREE.Vector2[]} vertices - representing the polygonal face of the prism
     * @param {number} height 
     */
    constructor(vertices, height) {
        const shape = new THREE.Shape();

        (function drawShape(ctx) {
            ctx.moveTo(vertices[0].x, vertices[0].y)
            for (let i = 1; i < vertices.length; i++) {
                ctx.lineTo(vertices[i].x, vertices[i].y)
            }
            ctx.lineTo(vertices[0].x, vertices[0].y)
        // eslint-disable-next-line semi
        })(shape);

        const settings = {
            depth: height,
            bevelEnabled: false,
        }

        super(shape, settings)
    }
}
