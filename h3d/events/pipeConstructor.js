import * as THREE from 'three'
import { ScreenPosition } from '../ScreenPosition'
import { getMeshByUserDataValue } from '../utils'
import { MOUSE_ACCURACY_THRESHOLD } from '../consts'
export function addPipeListener(domElement, threeElements) {
    const {
        scene,
        camera,
        pointer,
        raycaster,
    } = threeElements
    let anchor
    let tempMesh
    domElement.addEventListener('click', function heyRadiators(evt) {
        const mousePos = new THREE.Vector2(evt.clientX, evt.clientY)
        const radiators = getMeshByUserDataValue(scene, 'slateClass', 'Radiator')
        const positions = new ScreenPosition(domElement, camera)
        const pixels = radiators.map(radiator => positions.toPixels(radiator.position))
        const { closestIndex, closestDistance } = getClosest(pixels, mousePos)

        // terminate if none selected
        if (closestDistance > MOUSE_ACCURACY_THRESHOLD) return
        const closestRadiator = radiators[closestIndex]
        if (!closestRadiator) {
            anchor = null
            return
        }
        if (!anchor) {
            anchor = closestRadiator.position
        } else {
            const secondClick = closestRadiator.position
            const path = new Pipe([anchor, secondClick])
            const geometry = new THREE.TubeGeometry(path, 20, 50, 8, false)
            const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
            const mesh = new THREE.Mesh(geometry, material)
            scene.remove(tempMesh)
            scene.add(mesh)
            anchor = null
        }
    })
    
    domElement.addEventListener('mousemove', function() {
        if (!anchor) return
        raycaster.setFromCamera(pointer, camera)
        const intersects = raycaster.intersectObjects(scene.children)
        if (intersects.length > 0) {
            const intersectionPoint = intersects[0].point
            const path = new Pipe([anchor, intersectionPoint])
            const geometry = new THREE.TubeGeometry(path, 20, 50, 8, false)
            const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
            const mesh = new THREE.Mesh(geometry, material)
            scene.remove(tempMesh)
            scene.add(mesh)
            tempMesh = mesh
        }
    })
}

function getClosest(arrs, vector) {
    let closestIndex = -1
    let closestDistance = Infinity
    for (let i = 0; i < arrs.length; i++) {
        const arr = arrs[i]
        const d = arr.distanceTo(vector)
        if (d < closestDistance) {
            closestIndex = i
            closestDistance = d
        }
    }
    return {
        closestIndex,
        closestDistance,
    }
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