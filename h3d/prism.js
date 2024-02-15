import * as THREE from 'three'

export class PrismGeometry extends THREE.ExtrudeGeometry {
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
