import * as THREE from 'three'

export function getLighting() {
    const group = new THREE.Group()
    const light1 = new THREE.DirectionalLight( 0xffffff, 1 )
    light1.position.set( -3000, 3000, 0 )
    const light2 = new THREE.DirectionalLight( 0xffffff, 1 )
    light2.position.set( 3000, 3000, 0 )
    const light3 = new THREE.DirectionalLight( 0xffffff, 1 )
    light3.position.set( 3000, -3000, 0 )
    group.add(light1, light2, light3)
    return group
}