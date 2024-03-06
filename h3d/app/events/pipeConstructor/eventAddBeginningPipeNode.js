import * as THREE from 'three'
import { UndoableEvent } from '../historyManager.js'
import { getMeshByUserDataValue } from '../../utils.js'
import { ScreenPosition } from '../../ScreenPosition.js'
import { MOUSE_ACCURACY_THRESHOLD } from '../../consts.js'
import { endPipeRun } from './eventEndPipeRun.js'

/**
 * Given an anchor point, this adds a pipe leg to the pipe run.
 * @param {import('../../appHeat3d.js').Heat3DModel} app 
 * @param {import('.').PipeListenerSettings} pipeListenerSettings 
 * @param {Event} evt
 */
export class AddBeginningPipeNode extends UndoableEvent {
    constructor(app, pipeListenerSettings, evt) {
        super()
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

        // terminate if none selected
        if (closestDistance > MOUSE_ACCURACY_THRESHOLD) return
        const closestPipeEntry = pipeEntries[closestIndex]
        const anchor = closestPipeEntry?.getWorldPosition?.(new THREE.Vector3())
        this.pipeListenerSettings = pipeListenerSettings
        this.anchor = anchor
    }

    execute() {
        const {
            pipeListenerSettings,
            anchor,
        } = this
        const {
            anchors,
        } = pipeListenerSettings
        if (anchor) {
            anchors.push(anchor)
        }
    }

    undo() {
        const {
            pipeListenerSettings,
        } = this
        endPipeRun(pipeListenerSettings)
    }
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