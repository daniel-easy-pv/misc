import * as THREE from 'three'
import { AppModes } from './h3dModes'
import { ScreenPosition } from '../ScreenPosition'
import { findClosestCandidate, get3Frame } from './pipeConstructor'

const AXIS_COLORS = [
    'red',
    'green',
    'blue',
]

const GRID_DOT_SIZE = '3px'

export function addDebugPipeListener(app, anchors, euler) {
    const { 
        domElement,
        threeElements,
    } = app
    const {
        scene,
        camera,
    } = threeElements
    domElement.addEventListener('mousemove', function(evt) {
        if (app.mode !== AppModes.Insert) return
        if (anchors.length === 0) return
        const anchor = anchors[anchors.length - 1]
        const domElementOffset = new THREE.Vector2(domElement.offsetLeft, domElement.offsetTop)
        const mousePos = new THREE.Vector2(evt.clientX, evt.clientY).addScaledVector(domElementOffset, -1)
        destroyHelpers(domElement)
        const coordHelperGroup = document.createElement('div')
        coordHelperGroup.classList.add('coord-helpers')
        const axes = getHTMLAxes(domElement, anchor, euler, camera, mousePos)
        coordHelperGroup.appendChild(axes)
        const { 
            closestCandidateIndex, 
            circles, 
        } = findClosestCandidate(domElement, scene, anchor, euler, camera, mousePos)
        const circleGroup = drawCircles(domElement, circles, closestCandidateIndex)
        coordHelperGroup.appendChild(circleGroup)
        domElement.appendChild(coordHelperGroup)
        
    })
}

/**
 * Returns the axes for debugging purposes.
 * 
 * @param {string} domElement 
 * @param {THREE.Vector3} anchor 
 * @param {THREE.Euler} euler 
 * @param {THREE.Camera} camera 
 * @param {THREE.Vector2} mousePos 
 * @returns {HTMLDivElement}
 */
function getHTMLAxes(domElement, anchor, euler, camera, mousePos) {
    const UNIT = 1000 // distance from anchor to another point on each of the 3 axes, must be large enough for accuracy
    const axes = get3Frame(euler).map(axis => anchor.clone().addScaledVector(axis, UNIT))
    const screenPosition = new ScreenPosition(domElement, camera)
    // project axes to 2D
    const po = screenPosition.toPixels(anchor)
    const pm = mousePos.clone().addScaledVector(po, -1)
    const deltas = axes.map(v => screenPosition.toPixels(v))
        .map(v => v.clone().addScaledVector(po, -1).normalize())
    const qs = deltas.map(v => v.clone().multiplyScalar(v.dot(pm)))
    const projections = qs.map(v => v.clone().add(po))
    // draw on screen for debugging
    const rayGroup = document.createElement('div')
    for (let i = 0; i < projections.length; i++) {
        const p = projections[i]
        const ray = buildRay(po.x, po.y, p.x, p.y, AXIS_COLORS[i])
        rayGroup.appendChild(ray)
    }
    return rayGroup
}

function buildRay(startX, startY, endX, endY, color = 'black') {
    // Create a new div element for the ray
    const ray = document.createElement('div')
  
    // Calculate the length and angle of the ray
    const length = 1000
    const angle = Math.atan2(endY - startY, endX - startX)
  
    // Apply styles to make it a line (ray)
    ray.style.width = length + 'px'
    ray.style.height = '1px' // Adjust the thickness as needed
    ray.style.background = color
    ray.style.position = 'absolute'
    const navOffset = document.querySelector('nav')?.offsetHeight ?? 0
    ray.style.top = `${startY - navOffset}px`
    ray.style.left = startX + 'px'
    ray.style.transformOrigin = '0% 50%'
    ray.style.transform = 'rotate(' + angle + 'rad)'
    return ray
}

function destroyHelpers(domElement) {
    const coordHelperGroup = domElement.querySelector('.coord-helpers')
    coordHelperGroup?.parentNode.removeChild(coordHelperGroup)
}


function drawCircles(domElement, circles, closestCandidateIndex) {
    const circleGroup = document.createElement('div')
    for (let i = 0; i < circles.length; i++) {
        const c = circles[i]
        const circle = addCircle(c.x, c.y, i === closestCandidateIndex ? 'red' : 'black')
        circleGroup.appendChild(circle)
    }
    return circleGroup
}

function addCircle(left, top, color = 'black') {
    // Create a new div element
    const circle = document.createElement('div')
  
    circle.style.width = GRID_DOT_SIZE
    circle.style.height = GRID_DOT_SIZE
    circle.style.borderRadius = '50%'
    circle.style.background = color
  
    // Set the position using top and left properties
    circle.style.position = 'absolute'
    const navOffset = document.querySelector('nav')?.offsetHeight ?? 0
    circle.style.top = `${top - navOffset}px`
    circle.style.position = 'absolute'
    circle.style.left = left + 'px'
    circle.style.transform = 'translate(-50%,-50%)'
    return circle
}