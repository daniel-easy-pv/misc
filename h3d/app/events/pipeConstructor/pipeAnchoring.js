import * as THREE from 'three'
import { ScreenPosition } from '../../ScreenPosition.js'
import { getMeshByUserDataValue } from '../../utils.js'
import { MOUSE_ACCURACY_THRESHOLD } from '../../consts.js'
import { AppModes } from '../h3dModes.js'
export function addPipeAnchoringListener(app, pipeListenerSettings) {
    const {
        domElement,
        threeElements,
    } = app
    const {
        scene,
        camera,
    } = threeElements
    const {
        anchors,
    } = pipeListenerSettings

    domElement.addEventListener('stationaryClick', function anchorPipe(evt) {
        if (app.mode !== AppModes.Insert) return
        if (anchors.length !== 0) return
        evt.stopImmediatePropagation()
        const domElementOffset = new THREE.Vector2(domElement.offsetLeft, domElement.offsetTop)
        const mousePos = new THREE.Vector2(evt.detail.endX, evt.detail.endY).addScaledVector(domElementOffset, -1)
        const pipeEntries = getMeshByUserDataValue(scene, 'isPipeEntry', true)
        const screenPosition = new ScreenPosition(domElement, camera)
        const potentialSnapPositions = pipeEntries
            .map(entry => {
                const target = entry.getWorldPosition(new THREE.Vector3())
                return screenPosition.toPixels(target)
            })
        const { closestIndex, closestDistance } = getClosest(potentialSnapPositions, mousePos)

        // terminate if none selected
        if (closestDistance > MOUSE_ACCURACY_THRESHOLD) return
        const closestPipeEntry = pipeEntries[closestIndex]
        if (closestPipeEntry) {
            const anchor = closestPipeEntry.getWorldPosition(new THREE.Vector3())
            anchors.push(anchor)
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