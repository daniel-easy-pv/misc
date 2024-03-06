import * as THREE from 'three'
import { AppModes } from '../h3dModes.js'
import { AddBeginningPipeNode } from './eventAddBeginningPipeNode.js'
import { getMeshByUserDataValue } from '../../utils.js'
import { ScreenPosition } from '../../ScreenPosition.js'
import { MOUSE_ACCURACY_THRESHOLD } from '../../consts.js'

/**
 * Add listener for beginning a pipe run.
 * 
 * @param {import('../../appHeat3d.js').Heat3DModel} app 
 * @param {import('.').PipeListenerSettings} pipeListenerSettings 
 */
export function addPipeAnchoringListener(app, pipeListenerSettings) {
    const {
        domElement,
    } = app
    const {
        anchors,
        historyManager, 
    } = pipeListenerSettings

    domElement.addEventListener('stationaryClick', function anchorPipe(evt) {
        if (app.mode !== AppModes.Insert) return
        if (anchors.length !== 0) return
        evt.stopImmediatePropagation()
        const {
            domElement,
            threeElements,
        } = app
        const {
            scene,
            camera,
        } = threeElements
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
        const closestPipeEntry = pipeEntries[closestIndex]

        // start pipe run only if threshold met
        if (closestDistance < MOUSE_ACCURACY_THRESHOLD) {
            const anchor = closestPipeEntry.getWorldPosition(new THREE.Vector3())
            const command = new AddBeginningPipeNode(pipeListenerSettings, anchor)
            historyManager.executeCommand(command)
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