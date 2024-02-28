import { PipeCurve } from './PipeCurve'
import * as THREE from 'three'

export class UndoableEvent {
    execute() {}
    undo() {}
}

export class AddIntermediatePipeNode extends UndoableEvent {
    constructor(pipeGroup, anchors, secondClick) {
        super()
        if (anchors.length === 0) {
            throw Error('Pipe source not found')
        }
        const anchor = anchors[0]
        this.pipeGroup = pipeGroup
        this.anchors = anchors
        this.anchor = anchor
        this.secondClick = secondClick

        const path = new PipeCurve([anchor, secondClick])
        const geometry = new THREE.TubeGeometry(path, 20, 50, 8, false)
        const material = PipeCurve.Material
        const mesh = new THREE.Mesh(geometry, material)
        this.mesh = mesh
    }

    execute() {
        const { pipeGroup, mesh, anchors, secondClick } = this
        pipeGroup.add(mesh)
        anchors.length = 0
        anchors.push(secondClick)
    }

    undo() {
        const { pipeGroup, mesh, anchors, anchor } = this
        pipeGroup.remove(mesh)
        anchors.length = 0
        anchors.push(anchor)
    }
}

export class HistoryManager {
    constructor() {
        this.history = []
    }

    executeCommand(command) {
        command.execute()
        this.history.push(command)
    }

    undo() {
        if (this.history.length > 0) {
            const lastCommand = this.history.pop()
            lastCommand.undo()
        }
    }
}