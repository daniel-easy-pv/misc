class PipeSnapRule {
    /**
     * A wrapper for snapping.
     * 
     * @param {1|2|3} pipeSnapRuleNumber 
     * @param {THREE.Vector3} snapPoint 
     * @param {function} uiChange
     * @param {object} details 
     */
    constructor(pipeSnapRuleNumber, snapPoint, uiChange = () => {}, details = {}) {
        this.pipeSnapRuleNumber = pipeSnapRuleNumber
        this.snapPoint = snapPoint
        this.uiChange = uiChange
        this.details = details
    }
}

export class PipeSnapRuleIntersect extends PipeSnapRule {
    constructor(...stuff) {
        super(1, ...stuff)
    }
}

export class PipeSnapRuleValve extends PipeSnapRule {
    constructor(...stuff) {
        super(2, ...stuff)
    }
}

export class PipeSnapRuleFree extends PipeSnapRule {
    constructor(...stuff) {
        super(3, ...stuff)
    }
}
