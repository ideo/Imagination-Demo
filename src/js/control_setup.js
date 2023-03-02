import * as THREE from 'three'
import { ImmersiveControls } from './controls/ImmersiveControls'

export const setupImmersiveControls = (camera, renderer, scene, player) => {
    // IMMERSIVE CONTROLS
    const immersivecontrols = new ImmersiveControls(camera, renderer)
    immersivecontrols.mutedSticks.push(0) // mute the first controller's stick for controls.axes computation.
    scene.add(immersivecontrols.viewerSpace)
  
    // snap turn
  
    let snapDir = 'center'
  
    immersivecontrols.addEventListener('axeschange', (e) => {
      if (e.inputProfile !== 'controller') return
  
      if (e.xrInput.handedness == 'left') {
        const dir = e.xrInput.axesDirVector
        let newSnapDir
  
        if (Math.abs(dir.x) > 0.5) {
          newSnapDir = dir.x > 0 ? 'right' : 'left'
        } else {
          newSnapDir = 'center'
        }
  
        if (newSnapDir !== snapDir && newSnapDir !== 'center') {
          const snapRot = newSnapDir == 'left' ? 3 : -3
  
          immersivecontrols.viewerSpace.rotation.y += Math.PI / snapRot
        }
  
        snapDir = newSnapDir
      }
    })
  
    // teleport
  
    // THREE.LineBasicMaterial
    immersivecontrols.arcMaterial.color = new THREE.Color(0xb5948a)
    immersivecontrols.cursorMaterial.color = new THREE.Color(0xb5948a)
  
    immersivecontrols.addEventListener('clickstart', (e) => {
      if (e.inputProfile == 'controller' && e.handedness == 'right') {
        immersivecontrols.getRightXRInput().arcEnabled = true
      }
    })
  
    const translateVec = new THREE.Vector3()
  
    immersivecontrols.addEventListener('clickend', (e) => {
      if (e.inputProfile == 'controller' && e.handedness == 'right') {
        const xrInput = immersivecontrols.getRightXRInput()
        xrInput.arcEnabled = false
  
        // you could check that we are pointing to a ground and not a wall :
        // console.log( xrInput.cursorNormal.y > 0.5 )
  
        translateVec.copy(xrInput.cursorPosition)
        translateVec.sub(player.collider.start)
        player.collider.translate(translateVec)
        immersivecontrols.viewerSpace.position.copy(player.collider.start)
      }
    })
  
    return immersivecontrols
  }