export function addMouseListeners(app) {
    addPointerListener(app)
    addStationaryClickListener(app)
}

function addPointerListener(app) {
    const {
        domElement,
        threeElements,
    } = app
    const {
        pointer,
    } = threeElements
    domElement.addEventListener('mousemove', function onPointerMove(event) {
        const elementRect = domElement.getBoundingClientRect()
        pointer.x = ((event.clientX - elementRect.left) / domElement.clientWidth) * 2 - 1
        pointer.y = -((event.clientY - elementRect.top) / domElement.clientHeight) * 2 + 1
    })
}

/**
 * Distance threshold for considering a click as stationary (in pixels).
 * @type {number}
 */
const DISTANCE_THRESHOLD = 10


function addStationaryClickListener(app) {
    const {
        domElement,
    } = app
    let startX, startY

    domElement.addEventListener('mousedown', 
    /**
     * Records the mouse down coordinates.
     * 
     * @param {MouseEvent} event 
     */
        function(event) {
            startX = event.clientX
            startY = event.clientY
        })

    domElement.addEventListener('mouseup', 
    /**
     * Fires the mouse up coordinates if within `DISTANCE_THRESHOLD` pixels of mouse down coordinates.
     * 
     * @param {MouseEvent} event 
     */
        function(event) {
            const endX = event.clientX
            const endY = event.clientY

            // Calculate the distance between mousedown and mouseup positions
            const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))

            if (distance <= DISTANCE_THRESHOLD) {
                const customEvent = new CustomEvent('stationaryClick', {
                    detail: {
                        startX,
                        startY,
                        endX,
                        endY,
                    }
                })
                domElement.dispatchEvent(customEvent)
            }
        })
}