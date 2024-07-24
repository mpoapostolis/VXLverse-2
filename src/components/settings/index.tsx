import { useStore } from "@/lib/store"
import { Object3D } from "three"
import { degToRad } from "three/src/math/MathUtils.js"
import { npcType } from "../characters"
import { scenes } from "../scenes"
export function Settings() {
  const store = useStore()
  return (
    <div className="p-4 flex flex-col overflow-auto bg-base-300 fixed right-0 top-0 h-screen z-50 w-96">
      <label className="form-control w-full ">
        <div className="label text-sm">
          <span className="label-text">Select scene</span>
        </div>
        <select onChange={(e) => store.setScene(e.target.value)} className="select select-xs select-bordered w-full ">
          {scenes.map((scene) => (
            <option selected={store.scene === scene} key={scene} value={scene}>
              {scene}
            </option>
          ))}
        </select>
      </label>

      <div className="divider my-4" />

      {store.npcs.map((npc, idx) => (
        <div className="my-2 bg-base-100 grid gap-1 p-3" key={npc.name + idx}>
          <label className="form-control w-full ">
            <div className="label text-sm">
              <span className="label-text">Select Type</span>
            </div>
            <select
              onChange={(e) =>
                store.updateNpc({
                  ...npc,
                  type: e.target.value as typeof npc.type,
                })
              }
              className="select rounded-none w-full select-xs select-bordered"
            >
              {npcType.map((type) => (
                <option selected={npc.type === type} key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control w-full ">
            <div className="label text-sm">
              <span className="label-text">Name</span>
            </div>
            <input
              className="input input-bordered rounded-none input-xs w-full"
              placeholder="Name..."
              value={npc.name}
              onChange={(e) => store.updateNpc({ ...npc, name: e.target.value })}
            />
          </label>
          <div>
            <label className="label text-sm">Position</label>
            <div className="grid gap-3 grid-cols-3 items-center">
              <input
                step={0.1}
                type="number"
                className="input input-bordered rounded-none input-xs w-full"
                placeholder="X"
                value={npc.position[0]}
                onChange={(e) =>
                  store.updateNpc({
                    ...npc,
                    position: [parseFloat(e.target.value), npc.position[1], npc.position[2]],
                  })
                }
              />
              <input
                step={0.1}
                type="number"
                className="input input-bordered rounded-none input-xs w-full"
                placeholder="Y"
                value={npc.position[1]}
                onChange={(e) =>
                  store.updateNpc({
                    ...npc,
                    position: [npc.position[0], parseFloat(e.target.value), npc.position[2]],
                  })
                }
              />
              <input
                step={0.1}
                type="number"
                className="input input-bordered rounded-none input-xs w-full"
                placeholder="Z"
                value={npc.position[2]}
                onChange={(e) =>
                  store.updateNpc({
                    ...npc,
                    position: [npc.position[0], npc.position[1], parseFloat(e.target.value)],
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="label text-sm">Rotation</label>
            <div className="grid gap-3 grid-cols-3 items-center">
              <input
                type="number"
                className="input input-bordered rounded-none input-xs w-full"
                placeholder="X"
                value={npc.rotation[0]}
                onChange={(e) =>
                  store.updateNpc({
                    ...npc,
                    rotation: [degToRad(parseFloat(e.target.value)), npc.rotation[1], npc.rotation[2]],
                  })
                }
              />
              <input
                type="number"
                className="input input-bordered rounded-none input-xs w-full"
                placeholder="Y"
                value={npc.rotation[1]}
                onChange={(e) =>
                  store.updateNpc({
                    ...npc,
                    rotation: [npc.rotation[0], degToRad(parseFloat(e.target.value)), npc.rotation[2]],
                  })
                }
              />
              <input
                type="number"
                className="input input-bordered rounded-none input-xs w-full"
                placeholder="Z"
                value={npc.rotation[2]}
                onChange={(e) =>
                  store.updateNpc({
                    ...npc,
                    rotation: [npc.rotation[0], npc.rotation[1], degToRad(parseFloat(e.target.value))],
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="label text-sm">Scale ({npc.scale.at(0)?.toFixed(1)} )</label>
            <input
              type="range"
              min={0}
              max={10}
              step={0.1}
              className="range range-xs"
              value={npc.scale[0]}
              onChange={(e) =>
                store.updateNpc({
                  ...npc,
                  scale: [parseFloat(e.target.value), parseFloat(e.target.value), parseFloat(e.target.value)],
                })
              }
            />
            <button className="btn  btn-error w-full rounded-none mt-3 btn-xs" onClick={() => store.removeNpc(npc)}>
              Remove
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={() => {
          const uuid = new Object3D().uuid
          store.addNpc({
            uuid,
            name: "New NPC",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
            scene: store.scene,
            type: "hero",
          })
        }}
        className="btn rounded-none w-full sticky bottom-0 bg-base-300 mt-auto btn-outline"
      >
        Add NPC
      </button>
    </div>
  )
}
