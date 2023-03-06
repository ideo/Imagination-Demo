import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { promisifyLoader } from './utils'
// import { MeshBVH } from 'three-mesh-bvh' // use bvh if you want to switch to buffer geometry see https://github.com/gkjohnson/three-mesh-bvh/blob/master/example/characterMovement.js

// "Tshirt Test" (https://skfb.ly/6VVAS) by lukedew99 is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
import modelFile from '../models/tshirt_test.glb'
import kimonoFile from '../models/kimono.glb'
import swimsuitFile from '../models/swimsuit.glb'

// "VR Gallery" (https://skfb.ly/ooRLp) by Maxim Mavrichev is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
import envFile from '../models/vr_gallery_hq.glb'

import { configurePlayer } from './player'
import { setupImmersiveControls } from './control_setup'
import aitex from '../images/test.png'
import { setupPico } from './pico'
import { setupText } from './text'
import { getImage } from './image'

export const createScene = async (container) => {
  const clock = new THREE.Clock()

  const scene = new THREE.Scene()
  window.scene = scene // in case we want to interact in the console
  scene.background = new THREE.Color(0xffffff)

  const colliders = new THREE.Object3D()
  scene.add(colliders)

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 20)
  camera.position.set(0, 1.5 * 1.1, 0)
  camera.rotation.set(0, -0.5, 0)

  const controls = new PointerLockControls(camera, container)
  container.addEventListener('mousedown', () => {
    controls.lock()
  })
  document.addEventListener('mouseup', () => {
    controls.unlock()
  })

  // text display
  const messGroup = new THREE.Group()
  messGroup.position.set(0, 2.6, 0)
  const setMess = setupText(0.125, 0.025, messGroup, 'black')
  scene.add(messGroup)

  const writeMessage = (mess) => {
    setMess(mess)
  }

  const promptGroup = new THREE.Group()
  promptGroup.position.set(0, 2.2, 0)
  const setPrompt = setupText(0.125, 0.025, promptGroup, 'black')
  scene.add(promptGroup)

  let currentPrompt = ''
  const displayOutput = (out) => {
    setPrompt(out)
    currentPrompt = out
  }

  // SCENE GEOMETRY
  // add your content here, e.g. load a glb model
  // child anything you want to be navigable to colliders
  const size = 10
  const floorGeometry = new THREE.PlaneGeometry(size, size)
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -0.001
  colliders.add(floor)

  const loader = promisifyLoader(new GLTFLoader())

  const gltf = await loader.load(modelFile)
  const gltfKimono = await loader.load(kimonoFile)
  const gltfSwimsuit = await loader.load(swimsuitFile)

  // use this if you'd like your model to rest on the ground
  // gltf.scene.updateMatrixWorld(true)
  // const box = new THREE.Box3().setFromObject(gltf.scene)
  // const offset = -box.min.y

  scene.add(gltf.scene)
  const ssc = 0.015
  gltf.scene.scale.set(ssc,ssc,ssc)
  gltf.scene.position.set(0,1,0)

  scene.add(gltfKimono.scene)
  gltfKimono.scene.scale.set(ssc,ssc,ssc)
  gltfKimono.scene.position.set(1,1,0)

  scene.add(gltfSwimsuit.scene)
  gltfSwimsuit.scene.scale.set(ssc,ssc,ssc)
  gltfSwimsuit.scene.position.set(-1,1,0)

  const configTexture = async (url) => {
    const texture = await new THREE.TextureLoader().load(url)
    texture.anisotropy = 1
    const sc = 1.5
    texture.repeat.set(sc, sc)
    texture.offset.set(0.2,-0.475)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping

    return texture
  }

  const configTextureKimono = async (url) => {
    const texture = await new THREE.TextureLoader().load(url)
    texture.anisotropy = 1
    const sc = 1
    texture.repeat.set(sc, sc)
    texture.offset.set(0.4,-0.1)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping

    return texture
  }

  const configTextureSwimsuit = async (url) => {
    const texture = await new THREE.TextureLoader().load(url)
    texture.anisotropy = 1
    const sc = 1
    texture.repeat.set(sc, sc)
    texture.offset.set(0.25,-0.1)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping

    return texture
  }

  const texture = await configTexture(aitex)
  const textureKimono = await configTextureKimono(aitex)
  const textureSwimsuit = await configTextureSwimsuit(aitex)

  let updateMaterials = []
  let updateKimonoMaterials = []
  let updateSwimMaterials = []
  //Traverse GLTF and update materials
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true

      if (child.material.map) {
        child.material.map = texture
        child.material.side = THREE.DoubleSide
        updateMaterials.push(child.material)
      }
    }
  })
  gltfKimono.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true

      if (child.material.map) {
        child.material.map = textureKimono
        child.material.side = THREE.DoubleSide
        updateKimonoMaterials.push(child.material)
      }
    }
  })
  gltfSwimsuit.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true

      if (child.material.map) {
        child.material.map = textureSwimsuit
        child.material.side = THREE.DoubleSide
        updateSwimMaterials.push(child.material)
      }
    }
  })

  const updateTexture = async (url) => {
    const newtex = await configTexture(url)
    setMess("Here's your new pattern!")
    updateMaterials.forEach((m) => {
      m.map = newtex
    })
  }
  const updateTextureKimono = async (url) => {
    const newtex = await configTextureKimono(url)
    updateKimonoMaterials.forEach((m) => {
      m.map = newtex
    })
  }
  const updateTextureSwimsuit = async (url) => {
    const newtex = await configTextureSwimsuit(url)
    updateSwimMaterials.forEach((m) => {
      m.map = newtex
    })
  }

  const envgltf = await loader.load(envFile)
  scene.add(envgltf.scene)
  envgltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.receiveShadow = true
    }
  })

  // LIGHTS

  const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
  hemiLight.color.setHSL( 0.6, 1, 0.6 );
  hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
  hemiLight.position.set( 0, 3, 0 );
  scene.add( hemiLight );

  // const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
  // scene.add( hemiLightHelper );

  const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
  dirLight.color.setHSL( 0.1, 1, 0.95 );
  dirLight.position.set( - 1, 1.75, 1 );
  dirLight.position.multiplyScalar( 2 );
  scene.add( dirLight );

  dirLight.castShadow = true;

  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;

  const d = 50;

  dirLight.shadow.camera.left = - d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = - d;

  dirLight.shadow.camera.far = 3500;
  dirLight.shadow.bias = - 0.0001;

  // const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 10 );
  // scene.add( dirLightHelper );


  // RENDERER

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.VSMShadowMap
  renderer.xr.enabled = true

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  container.appendChild(renderer.domElement)
  container.appendChild(VRButton.createButton(renderer))

  // PLAYER & VR CONTROLS

  const player = {}
  const immersivecontrols = setupImmersiveControls(camera, renderer, scene, player)
  configurePlayer(player, colliders, immersivecontrols, camera, -2.75, 4.25)

  const STEPS_PER_FRAME = 2
  renderer.setAnimationLoop(() => {
    const deltaTime = Math.min(0.05, clock.getDelta()) / STEPS_PER_FRAME

    for (let i = 0; i < STEPS_PER_FRAME; i++) {
      player.update(deltaTime)
      immersivecontrols.update(deltaTime)
    }

    renderer.render(scene, camera)
  })

  // voice recognition & openai connection
  const pico = setupPico(writeMessage, displayOutput)
  let recording = false
  const startRecording = () => {
    if (!recording) {
      currentPrompt = ''
      pico.startRecord()
      recording = true
    }
  }
  const stopRecording = () => {
    pico.stopRecord()
    recording = false
  }

  const retrieveImage = () => {
    if (currentPrompt) {
      getImage(currentPrompt, updateTexture)
      getImage(currentPrompt, updateTextureKimono)
      getImage(currentPrompt, updateTextureSwimsuit)
      setMess('Retrieving new pattern...')
    }
  }


  // keyboard mappings
  window.addEventListener(
    'keydown',
    (event) => {
      if (event.code == 'KeyX') {
        startRecording()
      }
    },
    false
  )
  window.addEventListener(
    'keyup',
    (event) => {
      if (event.code == 'KeyX') {
        stopRecording()
      }

      if (event.code == 'KeyY') {
        retrieveImage()
      }
    },
    false
  )

  // vr controller mappings
  immersivecontrols.addEventListener('keyup', (e) => {
    if (e.index == 5) retrieveImage()
    if (e.index == 4) stopRecording()
  })

  immersivecontrols.addEventListener('keydown', (e) => {
    if (e.index == 4) startRecording()
  })
}
