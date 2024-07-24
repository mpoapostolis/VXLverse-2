import { Canvas } from "@react-three/fiber"

import { Environment, OrbitControls } from "@react-three/drei"
import { Physics } from "@react-three/rapier"
import { EditCharacter } from "./components/characters/editCharacter"
import Lights from "./components/lights"
import { EditorScene } from "./components/scenes/editor-scene"
import { Settings } from "./components/settings"
import { useStore } from "./lib/store"

export default function Editor() {
  const store = useStore()
  return (
    <div className="w-screen h-screen">
      <Settings />
      <Canvas color="#171717" shadows>
        <OrbitControls makeDefault />
        <Environment background preset="night" />
        <Lights />
        <Physics debug timeStep="vary">
          <EditorScene />
          {store.npcs.map((npc) => (
            <EditCharacter {...npc} key={npc.uuid} />
          ))}
        </Physics>
      </Canvas>
    </div>
  )
}
