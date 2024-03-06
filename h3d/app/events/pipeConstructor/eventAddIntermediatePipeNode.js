import * as THREE from 'three'
import { UndoableEvent } from '../historyManager.js'
import { PipeMesh } from './PipeCurve.js'

/**
 * Given an anchor point, this adds a pipe leg to the pipe run.
 */
export class AddIntermediatePipeNode extends UndoableEvent {
    /**
     * 
     * @param {import('./index.js').PipeListenerSettings} pipeListenerSettings 
     * @param {THREE.Vector3} secondClick 
     * @param {boolean} endPipeRun
     */
    constructor(pipeListenerSettings, secondClick, endPipeRun) {
        super()
        const {
            anchors,
            pipeGroup,
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
        const pipeRadius = 20
        const mesh = new PipeMesh(anchor, secondClick, pipeRadius)
        this.mesh = mesh

        // add imaginary valve for future pipe connections
        const imaginaryValve = new THREE.Group()
        imaginaryValve.userData.isPipeEntry = true
        imaginaryValve.position.copy(secondClick)
        this.imaginaryValve = imaginaryValve
        
    }

    execute() {
        const { pipeGroup, mesh, anchors, secondClick, endPipeRun } = this
        pipeGroup.add(mesh)
        anchors.length = 0
        if (!endPipeRun) {
            anchors.push(secondClick)
            pipeGroup.add(this.imaginaryValve)
        }
    }

    undo() {
        const { pipeGroup, mesh, anchors, anchor } = this
        pipeGroup.remove(this.imaginaryValve)
        pipeGroup.remove(mesh)
        anchors.length = 0
        anchors.push(anchor)
    }
}
