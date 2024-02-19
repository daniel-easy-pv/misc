import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { getLevel } from './levelShapes.js'
import { getLighting } from './lighting.js'
import { getBarycenter, preprocess } from './preprocess.js'
import { initEvents } from './events.js'
import { ScreenPosition } from './ScreenPosition.js'

export class Heat3DModel {
    constructor(
        domElementName,
        eTempFloorplan,
    ) {
        const domElement = document.getElementById(domElementName)
        const data = preprocess(eTempFloorplan)
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera( 75, domElement.offsetWidth / domElement.offsetHeight,
            10, 100000 )
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
        })
        const pointer = new THREE.Vector2()
        const raycaster = new THREE.Raycaster()
        camera.up.set(0, 0, 1)
        const b = getBarycenter(eTempFloorplan)
        camera.position.set(b[0], -b[1]-10000, 0)
        const controls = new OrbitControls(camera, domElement)
        controls.target.set(b[0],-b[1], 0)
        renderer.setSize(domElement.offsetWidth, domElement.offsetHeight)
        renderer.setClearColor( 0xFFFFFF )
        renderer.setPixelRatio(window.devicePixelRatio)
        domElement.appendChild(renderer.domElement)

        scene.add( getLevel(data) )
        scene.add( getLighting())
        const axes = new THREE.AxesHelper(20000)
        axes.position.set(b[0], -b[1], 0)
        scene.add(axes)
        
        let animationFrameId
        function animate() {
            animationFrameId = requestAnimationFrame( animate )
            render()
        }
        function render() {
            camera.updateMatrixWorld()
            controls.update()
            renderer.render( scene, camera )
        }
        animate()
        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        this.destroy = () => {
            cancelAnimationFrame(animationFrameId)
            domElement.innerHTML = ''
        }

        initEvents(domElement, {
            scene,
            camera,
            pointer,
            raycaster,
        })

        this.screenPosition = new ScreenPosition(domElement, camera)
    }
}