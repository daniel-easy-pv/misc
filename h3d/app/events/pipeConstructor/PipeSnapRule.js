/**
 * @typedef {import('three').Vector3} THREE.Vector3
 */

/**
 * @typedef {object} PipeSnapRuleDetails
 * @property {string} someDetail - Some detail about the rule.
 * @property {number} anotherDetail - Another detail about the rule.
 */

/**
 * A wrapper for snapping.
 * 
 * @class
 * @classdesc Base class for pipe snap rules.
 */
export class PipeSnapRule {
    /**
     * @typedef {1|2|3} PipeSnapRuleNumber
     */

    /**
     * @typedef {function} UiChangeFunction
     * @param {string} newValue - The new value.
     */

    /**
     * @typedef {object} PipeSnapRuleOptions
     * @property {PipeSnapRuleNumber} pipeSnapRuleNumber - The pipe snap rule number.
     * @property {THREE.Vector3} snapPoint - The snap point in 3D space.
     * @property {UiChangeFunction} uiChange - The UI change function.
     * @property {PipeSnapRuleDetails} details - Additional details about the rule.
     */

    /**
     * @param {PipeSnapRuleOptions} options - The options for creating a PipeSnapRule instance.
     */
    constructor(options) {
        this.pipeSnapRuleNumber = options.pipeSnapRuleNumber
        this.snapPoint = options.snapPoint
        this.uiChange = options.uiChange || (() => {})
        this.details = options.details || {}
    }
}

/**
 * @class
 * @classdesc Class representing a pipe snap rule for intersections.
 * @extends PipeSnapRule
 */
export class PipeSnapRuleIntersect extends PipeSnapRule {
    /**
     * @param {PipeSnapRuleOptions} options - The options for creating a PipeSnapRuleIntersect instance.
     */
    constructor(options) {
        super({ ...options, pipeSnapRuleNumber: 1 })
    }
}

/**
 * @class
 * @classdesc Class representing a pipe snap rule for valves.
 * @extends PipeSnapRule
 */
export class PipeSnapRuleValve extends PipeSnapRule {
    /**
     * @param {PipeSnapRuleOptions} options - The options for creating a PipeSnapRuleValve instance.
     */
    constructor(options) {
        super({ ...options, pipeSnapRuleNumber: 2 })
    }
}

/**
 * @class
 * @classdesc Class representing a pipe snap rule for valves.
 * @extends PipeSnapRule
 */
export class PipeSnapRuleFree extends PipeSnapRule {
    /**
     * @param {PipeSnapRuleOptions} options - The options for creating a PipeSnapRuleFree instance.
     */
    constructor(options) {
        super({ ...options, pipeSnapRuleNumber: 3 })
    }
}