import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Object3D } from "three"
import { allNpcTypes } from "../npc"
import { allScenes } from "../scene"

export function Settings() {
  const store = useStore()
  return (
    <div className="p-4 flex flex-col gap-4 overflow-auto bg-base-300 fixed right-0 top-0 h-screen z-50 w-96">
      <div className=" bg-base-100 p-3">
        <label className="form-control w-full grid gap-2 ">
          <div className="label text-sm">
            <span className="label-text">Select scene</span>
          </div>
          <select
            defaultValue={store.scene}
            onChange={(e) => store.setScene(e.target.value)}
            className="select select-xs select-bordered w-full "
          >
            {allScenes.map((scene) => (
              <option key={scene}>{scene}</option>
            ))}
          </select>

          <label className="label text-sm">Scale ({store.sceneConfig[store.scene]?.toFixed(1)} )</label>

          <input
            type="range"
            min={0}
            max={100}
            step={0.5}
            className="range range-xs"
            onChange={(e) =>
              store.setSceneConfig({
                ...store.sceneConfig,
                [store.scene]: parseFloat(e.target.value),
              })
            }
          />
        </label>
      </div>

      {store.npcs
        .filter((npc) => npc.scene === store.scene)
        .map((npc, idx) => (
          <div
            onClick={() => store.setSelectedNpc(npc.uuid)}
            className={cn(" bg-base-100 grid grid-cols-2 gap-1 p-3", {
              "border border-yellow-200 bg-black": store.selectedNpc === npc.uuid,
            })}
            key={npc.name + idx}
          >
            <label className="form-control w-full ">
              <div className="label text-sm">
                <span className="label-text">Name</span>
              </div>

              <input
                className="input input-bordered rounded-none input-xs w-full"
                placeholder="Name..."
                defaultValue={npc.name}
                onBlur={(e) => store.updateNpc({ ...npc, name: e.target.value })}
              />
            </label>

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
                defaultValue={npc.type}
                className="select rounded-none w-full select-xs select-bordered"
              >
                <option disabled value="Select Type"></option>
                {allNpcTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <div className="w-full col-span-2">
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
            </div>
            <button
              aria-colspan={2}
              className="btn col-span-2 btn-error w-full rounded-none mt-3 btn-xs"
              onClick={() => store.removeNpc(npc)}
            >
              Remove
            </button>
          </div>
        ))}

      <button
        onClick={() => {
          const uuid = new Object3D().uuid
          store.setSelectedNpc(uuid)
          store.addNpc({
            uuid,
            name: "New NPC",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
            scene: store.scene,
            type: allNpcTypes?.at(0),
          })
        }}
        className="btn rounded-none w-full sticky bottom-0 bg-base-300 mt-auto btn-outline"
      >
        Add NPC
      </button>
    </div>
  )
}
