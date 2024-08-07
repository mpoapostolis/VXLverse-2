import { useGameConfigStore } from "@/lib/game-store"
import { Environment, GizmoHelper, GizmoViewport, Html, TransformControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Camera } from "../camera"

import { Glb } from "@/components/glb"
import { useEditor } from "../provider"

export function EditorCanvas() {
  const store = useGameConfigStore()
  const {
    selectedScene,
    selected3dModel,
    setSelected3dModel,
    position,
    setPosition,
    mode,
    handleDrop,
    updateFn,
    keyForCanvas,
  } = useEditor()

  const currentScene = store.scenes.find((scene) => scene.uuid === selectedScene)

  return (
    <Canvas key={keyForCanvas} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} shadows>
      <Camera />
      <gridHelper args={[1000, 1000]} />

      <Html
        position={[position[0], position[1] + 1, position[2]]}
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
      >
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="badge badge-warning">asda</div>
        </div>
      </Html>

      <Environment background preset={currentScene?.preset ?? "night"} />
      <ambientLight />
      <GizmoHelper alignment="top-right" margin={[80, 80]}>
        <GizmoViewport axisColors={["#FF7F9A", "#C2EE00", "#73C5FF"]} />
      </GizmoHelper>

      {store.glbs
        .filter((glb) => glb.scene === selectedScene)
        .map((glb) => (
          <TransformControls
            mode={mode}
            key={glb.uuid}
            position={glb.position}
            scale={glb.scale}
            rotation={glb.rotation}
            showX={selected3dModel === glb.uuid}
            showY={selected3dModel === glb.uuid}
            showZ={selected3dModel === glb.uuid}
            enabled={selected3dModel === glb.uuid}
            onClick={(e) => {
              setPosition([e.point.x, e.point.y, e.point.z])
              setSelected3dModel(glb.uuid)
            }}
            onObjectChange={(e) => {
              // @ts-ignore
              const { position, scale, rotation } = e.target.object
              updateFn({
                ...glb,
                position: [position.x, position.y, position.z],
                scale: [scale.x, scale.y, scale.z],
                rotation: [rotation.x, rotation.y, rotation.z],
              })
            }}
          >
            <Glb isEdit {...glb} />
          </TransformControls>
        ))}
    </Canvas>
  )
}
