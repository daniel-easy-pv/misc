import * as THREE from 'three'
import { ScreenPosition } from './ScreenPosition'
import { getMeshByUserDataValue } from './utils'
import { MOUSE_ACCURACY_THRESHOLD } from './consts'

export function initEvents(domElement, {
    scene,
    camera,
    pointer,
    raycaster,
} = {}) {
    domElement.addEventListener('mousemove', function onPointerMove(event) {
        const elementRect = domElement.getBoundingClientRect()
        pointer.x = ((event.clientX - elementRect.left) / domElement.clientWidth) * 2 - 1
        pointer.y = -((event.clientY - elementRect.top) / domElement.clientHeight) * 2 + 1
    })
    // domElement.addEventListener('click', function() {
    //     raycaster.setFromCamera(pointer, camera)
    //     const intersects = raycaster.intersectObjects(scene.children)
    //         .filter(intersection => intersection.object.userData.slateClass === 'Radiator')
    //     if (intersects.length > 0) {
    //         console.log(intersects[0])
    //     }
    // })
    let firstClick
    let tempMesh
    domElement.addEventListener('click', function heyRadiators(evt) {
        const mouseX = evt.clientX
        const mouseY = evt.clientY
        const mousePos = new THREE.Vector2(mouseX, mouseY)
        const radiators = getMeshByUserDataValue(scene, 'slateClass', 'Radiator')
        const positions = new ScreenPosition(domElement, camera)
        const pixels = radiators.map(radiator => positions.toPixels(radiator.position))
        let closestIndex = -1
        let closestDistance = Infinity
        for (let i = 0; i < pixels.length; i++) {
            const pixel = pixels[i]
            const distance = pixel.distanceTo(mousePos)
            if (distance < closestDistance) {
                closestIndex = i
                closestDistance = distance
            }
        }
        if (closestDistance > MOUSE_ACCURACY_THRESHOLD) return
        const closestRadiator = radiators[closestIndex]
        if (!closestRadiator) {
            firstClick = null
            return
        }
        if (!firstClick) {
            firstClick = closestRadiator.position
        } else {
            const secondClick = closestRadiator.position
            const path = new Pipe([firstClick, secondClick])
            const geometry = new THREE.TubeGeometry(path, 20, 50, 8, false)
            const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
            const mesh = new THREE.Mesh(geometry, material)
            scene.remove(tempMesh)
            scene.add(mesh)
            firstClick = null
        }
    })
    
    domElement.addEventListener('mousemove', function(evt) {
        if (!firstClick) return
        raycaster.setFromCamera(pointer, camera)
        const intersects = raycaster.intersectObjects(scene.children)
        if (intersects.length > 0) {
            const intersectionPoint = intersects[0].point
            const path = new Pipe([firstClick, intersectionPoint])
            const geometry = new THREE.TubeGeometry(path, 20, 50, 8, false)
            const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
            const mesh = new THREE.Mesh(geometry, material)
            scene.remove(tempMesh)
            scene.add(mesh)
            tempMesh = mesh
        }
    })
}

class Pipe extends THREE.Curve {
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