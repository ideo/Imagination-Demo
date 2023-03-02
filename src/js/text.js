import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import fontjson from '../fonts/helvetiker.json'

export const setupText = (size, height, group, color) => {
  const loader = new FontLoader()
  const font = loader.parse(fontjson)
  let textMesh1 = null

  const materials = [
    new THREE.MeshPhongMaterial( { color, flatShading: true } ), // front
    new THREE.MeshPhongMaterial( { color } ) // side
  ];

  const createText = (mess) => {
    const textGeo = new TextGeometry(mess, {
      font: font,

      size: size,
      height: height,
      curveSegments: 12,

      bevelThickness: 0,
      bevelSize: 0,
      bevelEnabled: false,
    })

    textGeo.computeBoundingBox()

    const centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x)

    textMesh1 = new THREE.Mesh(textGeo, materials)

    textMesh1.position.x = centerOffset
    textMesh1.position.y = 0
    textMesh1.position.z = 0

    textMesh1.rotation.x = 0
    textMesh1.rotation.y = Math.PI * 2

    group.add(textMesh1)
  }

  const refreshText = (mess) => {
    if (textMesh1) group.remove(textMesh1)

    createText(mess)
  }

  return refreshText
}
