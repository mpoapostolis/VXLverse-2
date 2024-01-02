/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Author: sirsaugsage (https://sketchfab.com/sirsausage)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/fantasy-game-inn-192bf30a7e28425ab385aef19769d4b0
Title: Fantasy Game Inn
*/

import { useGLTF } from "@react-three/drei"
import { RigidBody } from "@react-three/rapier"
import * as THREE from "three"
import { GLTF } from "three-stdlib"

type GLTFResult = GLTF & {
  nodes: {
    TheInn_bakeInn_0: THREE.Mesh
  }
  materials: {
    bakeInn: THREE.MeshBasicMaterial
  }
}

export function Map(props: JSX.IntrinsicElements["group"]) {
  const gltf = useGLTF("/scenes.glb") as GLTFResult
  console.log(gltf)
  return (
    <RigidBody type="fixed">
      <mesh scale={5}>
        <primitive object={gltf.scene} {...props} dispose={null} />
      </mesh>
    </RigidBody>
  )
}

useGLTF.preload("/scenes.glb")
