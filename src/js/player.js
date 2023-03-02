import * as THREE from 'three'
import { Octree } from 'three/examples/jsm/math/Octree.js'
import { Capsule } from 'three/examples/jsm/math/Capsule.js'

export const configurePlayer = (player, colliders, immersivecontrols, camera, x, z) => {
  // config
  const playerYMin = -1.8

  let playerOnFloor = false
  const GRAVITY = 20

  // BUILD OCTOTREE
  const worldOctree = new Octree()
  worldOctree.fromGraphNode(colliders)
  immersivecontrols.navigationObject = colliders

  //COLLISION VARIABLES
  player.collider = new Capsule(new THREE.Vector3(x, 0, z), new THREE.Vector3(x, 1.5, z), 0.001)
  player.velocity = new THREE.Vector3()

  const crossVector = new THREE.Vector3()

  const playerCollisions = () => {
    const result = worldOctree.capsuleIntersect(player.collider)

    playerOnFloor = false

    if (result) {
      playerOnFloor = result.normal.y > 0

      if (!playerOnFloor) {
        player.velocity.addScaledVector(result.normal, -result.normal.dot(player.velocity))
      }

      player.collider.translate(result.normal.multiplyScalar(result.depth))
    }
  }

  player.update = (deltaTime) => {
    // camera target * input's "forward" power
    player.velocity.x = immersivecontrols.viewDirection.x * immersivecontrols.axes.y * 15
    player.velocity.z = immersivecontrols.viewDirection.z * immersivecontrols.axes.y * 15

    // add camera target * input's "side" power
    crossVector.copy(immersivecontrols.viewDirection)
    crossVector.cross(camera.up)
    player.velocity.x += crossVector.x * immersivecontrols.axes.x * 15
    player.velocity.z += crossVector.z * immersivecontrols.axes.x * 15

    if (playerOnFloor) {
      const damping = Math.exp(-3 * deltaTime) - 1
      player.velocity.addScaledVector(player.velocity, damping)
    } else {
      player.velocity.y -= GRAVITY * deltaTime
    }

    const deltaPosition = player.velocity.clone().multiplyScalar(deltaTime)
    player.collider.translate(deltaPosition)

    playerCollisions(Math.min(deltaTime, 0.1))

    if (player.collider.start.y < playerYMin) {
      player.collider.start.set(0, 0, 0)
      player.collider.end.set(0, 1.5, 0)
    }

    immersivecontrols.viewerSpace.position.copy(player.collider.start)
  }
}
