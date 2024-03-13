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
    let startEvent

    /**
     * Records the mouse down coordinates.
     * 
     * @param {MouseEvent} event 
     */
    function recordMouseStart(event) {
        startEvent = event
    }

    /**
     * Fires the mouse up coordinates if within `DISTANCE_THRESHOLD` pixels of mouse down coordinates.
     * 
     * @param {MouseEvent} event 
     */
    function fireStationaryClick(event) {
        const endEvent = event
        const dx = endEvent.offsetX - startEvent.offsetX
        const dy = endEvent.offsetY - startEvent.offsetY
        const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))

        if (distance <= DISTANCE_THRESHOLD) {
            /**
             * Custom event for a stationary click.
             * 
             * @type {CustomEvent<StationaryClickEventDetails>}
             */
            const customEvent = new CustomEvent('stationaryClick', {
                detail: {
                    startEvent,
                    endEvent,
                }
            })
            domElement.dispatchEvent(customEvent)
        }
    }
    
    domElement.addEventListener('mousedown', recordMouseStart)
    domElement.addEventListener('mouseup', fireStationaryClick)
}

/**
 * Custom event details for a stationary click event.
 */
export interface StationaryClickEventDetails extends CustomEvent {
    startEvent: MouseEvent
    endEvent: MouseEvent
}