import { useGameConfigStore } from "@/lib/game-store"
import { Environment, GizmoHelper, GizmoViewport, Plane } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"

import { Physics, RigidBody } from "@react-three/rapier"
import { useEditor } from "../provider"

export function EditorCanvas() {
  const store = useGameConfigStore()
  const { selectedScene } = useEditor()

  const currentScene = store.scenes.find((scene) => scene.uuid === selectedScene) ?? store.scenes[0]?.uuid
  console.log(currentScene, store.glbs)
  return (
    <Canvas onDragOver={(e) => e.preventDefault()} shadows>
      <Physics debug>
        {/* <Hero /> */}
        <Environment background preset={currentScene?.preset ?? "night"} />
        <ambientLight />
        <GizmoHelper alignment="top-right" margin={[80, 80]}>
          <GizmoViewport axisColors={["#FF7F9A", "#C2EE00", "#73C5FF"]} />
        </GizmoHelper>

        <RigidBody type="fixed">
          <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} />
        </RigidBody>

        {/* {store.glbs */}
        {/*   ?.filter((glb) => glb.scene === selectedScene && glb.type !== "hero") */}
        {/*   .map((glb) => ( */}
        {/*     <RigidBody colliders="trimesh" {...glb} friction={0} type="fixed" key={glb?.uuid}> */}
        {/*       <Gltf {...glb} /> */}
        {/*     </RigidBody> */}
        {/*   ))} */}

        {/* {store.glbs */}
        {/*   .filter((glb) => glb.scene === selectedScene || glb.type === "hero") */}
        {/*   .map((glb) => ( */}
        {/*     <RigidBody key={glb.uuid} type="fixed"> */}
        {/*       <TransformControls */}
        {/*         mode={"translate"} */}
        {/*         position={glb.position} */}
        {/*         scale={glb.scale} */}
        {/*         rotation={glb.rotation} */}
        {/*         // showX={selected3dModel === glb.uuid}aaa */}
        {/*         // showY={selected3dModel === glb.uuid} */}
        {/*         // showZ={selected3dModel === glb.uuid} */}
        {/*         // enabled={selected3dModel === glb.uuid} */}
        {/*         // onClick={(e) => { */}
        {/*         //   setPosition([e.point.x, e.point.y, e.point.z]) */}
        {/*         //   setSelected3dModel(glb.uuid) */}
        {/*         // }} */}
        {/*         onObjectChange={(e) => { */}
        {/*           // @ts-ignore */}
        {/*           const { position, scale, rotation } = e.target.object */}
        {/*           // updateFn({ */}
        {/*           //   ...glb, */}
        {/*           //   position: [position.x, position.y, position.z], */}
        {/*           //   scale: [scale.x, scale.y, scale.z], */}
        {/*           //   rotation: [rotation.x, rotation.y, rotation.z], */}
        {/*           // }) */}
        {/*         }} */}
        {/*       > */}
        {/*         <Glb isEdit {...glb} /> */}
        {/*       </TransformControls> */}
        {/*     </RigidBody> */}
        {/*   ))} */}
      </Physics>
    </Canvas>
  )
}
