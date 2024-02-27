// an enum for the different modes in pipe constructor
export class AppModes {
    static Insert = new AppModes('Insert')
    static View = new AppModes('View')

    constructor(name) {
        this.name = name
    }
}

export function addModeListener(app) {
    app.mode = AppModes.View
    const { domElement } = app
    domElement.appendChild(bottomBar(app.mode))

    domElement.addEventListener('keydown', function(evt) {
        if (evt.key === 'i') {
            updateMode(app, AppModes.Insert)
        }
        else if (evt.key === 'Escape') {
            updateMode(app, AppModes.View)
        }
    })
}

function updateMode(app, mode) {
    app.mode = mode
    app.domElement.querySelector('.h3d-bar').remove()
    app.domElement.appendChild(bottomBar(app.mode))
}

/**
 * 
 * @param {AppModes} mode 
 * @returns {HTMLDivElement}
 */
function bottomBar(mode) {
    const div = document.createElement('div')
    div.classList.add('h3d-bar')
    div.style = 'width: 100%; position:absolute; bottom:0;'
    div.textContent = `Mode: ${mode.name}`
    return div
}

