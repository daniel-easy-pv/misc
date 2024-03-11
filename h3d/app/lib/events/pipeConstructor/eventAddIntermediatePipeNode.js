import * as THREE from 'three'
import { UndoableEvent } from '../historyManager.js'
import { PipeMesh } from './PipeMesh.js'

/**
 * Given an anchor point, this adds a pipe leg to the pipe run.
 */
export class AddIntermediatePipeNode extends UndoableEvent {
    /**
     * 
     * @param {import('../../lib/init/initPipeListenerSettings.js').PipeListenerSettings} pipeListenerSettings 
     * @param {THREE.Vector3} secondClick 
     * @param {boolean} endPipeRun
     */
    constructor(pipeListenerSettings, secondClick, endPipeRun) {
        super()
        const {
            anchors,
            pipeGroup,
            pipeDiameter,
            pipeMaterial,
        } = pipeListenerSettings
        if (anchors.length === 0) {
            throw Error('Pipe source not found')
        }
        const anchor = anchors[0]
        this.pipeGroup = pipeGroup
        this.anchors = anchors
        this.anchor = anchor
        this.secondClick = secondClick
        this.endPipeRun = endPipeRun
        const start = [anchor.x, anchor.y, anchor.z]
        const end = [secondClick.x, secondClick.y, secondClick.z]
        const diameter = pipeDiameter
        const pipeMaterialName = pipeMaterial.name
        const pipeMesh = new PipeMesh({ start, end, diameter, pipeMaterialName })
        pipeMesh.userData.isPipeLeg = true
        this.pipeMesh = pipeMesh

        // add imaginary valve for future pipe connections
        const imaginaryValve = new THREE.Group()
        imaginaryValve.userData.isPipeEntry = true
        imaginaryValve.position.copy(secondClick)
        this.imaginaryValve = imaginaryValve
        
    }

    execute() {
        const { pipeGroup, pipeMesh, anchors, secondClick, endPipeRun } = this
        pipeGroup.add(pipeMesh)
        anchors.length = 0
        if (!endPipeRun) {
            anchors.push(secondClick)
            pipeGroup.add(this.imaginaryValve)
        }
    }

    undo() {
        const { pipeGroup, pipeMesh, anchors, anchor } = this
        pipeGroup.remove(this.imaginaryValve)
        pipeGroup.remove(pipeMesh)
        anchors.length = 0
        anchors.push(anchor)
    }
}
