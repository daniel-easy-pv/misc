import * as THREE from 'three'
import { ScreenPosition } from '../../ScreenPosition.js'
import { getMeshByUserDataValue } from '../../utils.js'
import { MOUSE_ACCURACY_THRESHOLD, UNITS } from '../../consts.js'
import { AppModes } from '../h3dModes.js'
import { HistoryManager } from '../historyManager.js'
import { addPipeContinuationListener } from './pipeContinuation.js'



/**
 * A function that adds pipe run listeners to a canvas
 * 
 * @param {import('../../appHeat3d.js').Heat3DModel} app 
 */
export function addPipeListener(app) {
    const {
        domElement,
        threeElements,
    } = app
    const {
        scene,
        camera,
    } = threeElements
    
    const pipeGroup = initPipeGroup(scene)
    
    const anchors = []
    let tempMesh
    const euler = new THREE.Euler(0, 0, 0, 'ZYX')
    const historyManager = new HistoryManager()

    const pipeListenerSettings = {
        pipeGroup,
        anchors,
        tempMesh,
        euler,
        historyManager,
    }

    domElement.addEventListener('stationaryClick', function buildPipe(evt) {
        if (app.mode !== AppModes.Insert) return
        const domElementOffset = new THREE.Vector2(domElement.offsetLeft, domElement.offsetTop)
        const mousePos = new THREE.Vector2(evt.detail.endX, evt.detail.endY).addScaledVector(domElementOffset, -1)
        
        // first click
        if (anchors.length === 0) {
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
        }
        domElement.dispatchEvent(new CustomEvent('updateFuschia'))
    })
    
    addPipeContinuationListener(app, pipeListenerSettings)
    

    domElement.addEventListener('keydown', function(evt) {
        if (evt.key === 'r') {
            euler.z += Math.PI / 4
            domElement.dispatchEvent(new CustomEvent('updateFuschia'))
        }
        else if (evt.key === 'Escape') {
            anchors.length = 0
            pipeGroup.remove(tempMesh)
            domElement.dispatchEvent(new CustomEvent('updateFuschia'))
            anchors.length = 0
        }
    })

    domElement.addEventListener('keydown', function(evt) {
        if (evt.ctrlKey && evt.key === 'z') {
            historyManager.undo()
        }
    })

    domElement.addEventListener('keydown', function(evt) {
        if (evt.ctrlKey && evt.key === 'y') {
            historyManager.redo()
        }
    })

    // addDebugPipeListener(app, anchors, euler)
    
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


/**
 * Returns the coordinate frame after rotating the standard frame by an Euler angle.
 * 
 * @param {THREE.Euler} euler
 */
export function get3Frame(euler) {
    return UNITS.map(v => v.clone().applyEuler(euler))
}

/**
 * Returns the pipe group already in the scene if exists, else creates one.
 * 
 * @param {THREE.Scene} scene 
 * @returns {THREE.Group}
 */
function initPipeGroup(scene) {
    const existingPipeGroup = getMeshByUserDataValue(scene, 'isPipeGroup', true)
    if (existingPipeGroup.length) {
        return existingPipeGroup[0]
    } else {
        const pipeGroup = new THREE.Group()
        pipeGroup.userData.isPipeGroup = true
        scene.add(pipeGroup)
        return pipeGroup
    }
}