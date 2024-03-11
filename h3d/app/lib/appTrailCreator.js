import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { getLighting } from '../materials/lighting.js'
import { initEvents } from './events/events.js'
import { initSelectedObjectsSettings } from './init/initSelectObjects.js'
import { initPipeListenerSettings } from './init/initPipeListenerSettings.js'
import { FRUSTUM_SIZE } from './init/consts.js'

const LAYER_MAGENTA_SPHERES = 1

export class TrailCreator {
    constructor(
        domElementName,
        data,
        barycenter,
    ) {
        const domElement = document.getElementById(domElementName)
        const scene = new THREE.Scene()
        const aspect = domElement.offsetWidth / domElement.offsetHeight
        const perspectiveCamera = new THREE.PerspectiveCamera( 75, domElement.offsetWidth / domElement.offsetHeight,
            10, 100000 )
        perspectiveCamera // not used
        const orthographicCamera = new THREE.OrthographicCamera(
            FRUSTUM_SIZE/-2 * aspect, 
            FRUSTUM_SIZE / 2 * aspect, 
            FRUSTUM_SIZE / 2, 
            FRUSTUM_SIZE / -2, 10, 1000000)
        const camera = orthographicCamera
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
        })
        const pointer = new THREE.Vector2()
        camera.up.set(0, 0, 1)
        camera.layers.enable(LAYER_MAGENTA_SPHERES)
        const b = barycenter
        const SCENE_CENTER = new THREE.Vector3(b[0], -b[1], 0)
        const CAM_DIST = 10000
        const CAM_POS = new THREE.Vector3(-CAM_DIST, -CAM_DIST, CAM_DIST).add(SCENE_CENTER)
        camera.position.copy(CAM_POS)
        const controls = new OrbitControls(camera, domElement)
        controls.target.copy(SCENE_CENTER)
        renderer.setSize(domElement.offsetWidth, domElement.offsetHeight)
        renderer.setClearColor( 0xFFFFFF )
        renderer.setPixelRatio(window.devicePixelRatio)
        domElement.appendChild(renderer.domElement)

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

        this.domElement = domElement
        this.threeElements = {
            scene,
            camera,
            renderer,
            pointer,
        }
        this.selectedObjectsSettings = initSelectedObjectsSettings()
        this.pipeListenerSettings = initPipeListenerSettings(this)
        this.destroy = () => {
            cancelAnimationFrame(animationFrameId)
            domElement.innerHTML = ''
        }

        initEvents(this)
    }

    pullData() {
        const { scene } = this.threeElements
        const data = {}
        scene.traverse(function(elt) {
            if (elt.userData.constructorParameters) {
                const key = elt.constructor.name
                const value = elt.userData.constructorParameters
                data[key] ??= []
                data[key].push(value)
            }
        })
        return data
    }
}