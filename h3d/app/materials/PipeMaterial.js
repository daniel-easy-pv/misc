export class PipeMaterial {
    static Copper = new PipeMaterial('Copper')
    static Plastic = new PipeMaterial('Plastic')
    constructor(name) {
        this.name = name
    }
}