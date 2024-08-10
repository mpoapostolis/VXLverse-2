import { Choice, GLBType, useGameConfigStore } from "@/lib/game-store"
import { cn } from "@/lib/utils"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { useEditor } from "../provider"
const heroActions = ["idle", "walk", "run", "jump", "action1"]
const npcActions = ["idle", "onInteract"]

function Option(props: Choice) {
  const store = useGameConfigStore()
  const { currentGlb: currentGlb } = useEditor()
  const choices = (currentGlb?.dialogue?.choices as Choice[]) ?? ([] as Choice[])

  const updateChoice = (choice: Partial<Choice>) =>
    store.updateGlb({
      ...currentGlb,
      dialogue: {
        ...currentGlb?.dialogue,
        choices: choices.map((k) => (k.uuid === props.uuid ? { ...k, ...choice } : k)),
      },
    })

  const deleteChoice = () =>
    store.updateGlb({
      ...currentGlb,
      dialogue: {
        ...currentGlb?.dialogue,
        choices: choices.filter((choice) => choice.uuid !== props.uuid),
      },
    })
  return (
    <div className={cn("h-full  border-white border-opacity-10 border p-3 bg-base-300")}>
      <label className="text-xs font-bold">Label:</label>
      <input
        defaultValue={props.label}
        onChange={(e) => updateChoice({ label: e.target.value })}
        placeholder="option"
        className="input placeholder:text-gray-600 rounded-none input-bordered border-r  w-full input-xs"
      />

      <label className="text-xs ">Required Money:</label>
      <input
        min={0}
        defaultValue={props.requiredMoney}
        onChange={(e) => updateChoice({ requiredMoney: parseInt(e.target.value) })}
        placeholder="80$"
        type="number"
        className="input mb-2 placeholder:text-gray-600 rounded-none input-bordered border-r  w-full input-xs"
      />

      <label className="text-xs">Required Item:</label>
      <select
        onChange={(e) => {
          updateChoice({ requiredItem: e.target.value })
        }}
        value={props?.requiredItem}
        className="select mb-2  rounded-none select-bordered w-full select-xs"
      >
        <option value={undefined}>None</option>
        {store.glbs.map((k) => (
          <option key={k.uuid} value={k.uuid}>
            {k.name}
          </option>
        ))}
      </select>

      <label className="text-xs">Required Energy:</label>
      <input
        min={0}
        max={100}
        defaultValue={props.requiredEnergy}
        onChange={(e) => updateChoice({ requiredEnergy: parseInt(e.target.value) })}
        placeholder="65"
        type="number"
        className="input mb-2 placeholder:text-gray-600 rounded-none input-bordered border-r  w-full input-xs"
      />

      <label className="text-xs">Reward</label>
      <div className="grid grid-cols-2 mb-2 gap-2">
        <select
          value={props.reward?.type}
          onChange={(e) => {
            updateChoice({ reward: { type: e.target.value as "money" | "energy" | "item" } })
          }}
          className="select rounded-none select-bordered w-full select-xs"
        >
          <option value={undefined}>None</option>
          {["item", "money", "energy"].map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
        <input
          onChange={(e) => {
            updateChoice({
              reward: {
                type: props.reward?.type,
                amount: undefined,
                item: undefined,
                [props.reward?.type === "item" ? "item" : "amount"]: props.reward.item
                  ? e.target.value
                  : parseInt(e.target.value),
              },
            })
          }}
          defaultValue={props.reward?.type === "item" ? props.reward?.item : props.reward?.amount}
          key={props.reward?.type}
          type={props.reward?.type === "item" ? "text" : "number"}
          className="input placeholder:text-gray-600 mb-2 rounded-none input-bordered  w-full input-xs"
        />
      </div>
      <div />
      <button
        onClick={() => {
          console.log(2)
          deleteChoice()
        }}
        className="btn rounded-none btn-xs w-full btn-error btn-outline btn-square"
      >
        Delete
      </button>
    </div>
  )
}

export function Settings() {
  const store = useGameConfigStore()
  const { selected3dModel } = useEditor()
  const currentGlb = store.glbs.find((k) => k.uuid === selected3dModel)

  const updateGlb = (glb: Partial<GLBType>) => store.updateGlb({ ...currentGlb, ...glb })
  const { animations } = useGLTF(currentGlb.url)
  const hero = store.glbs.find((k) => k.type === "hero")
  const animationSet = currentGlb.type === "hero" ? heroActions : npcActions
  return (
    <div className={cn("px-4 flex flex-col  gap-2 mt-4", {})}>
      {(currentGlb?.type === "hero" || (animations?.length > 2 && !hero?.uuid)) && (
        <>
          <div className="flex items-center gap-4">
            <label className="text-xs font-bold">Hero:</label>
            <input
              checked={currentGlb?.type === "hero"}
              onChange={(e) => {
                const checked = e.target.checked
                updateGlb({ type: checked ? "hero" : "npc" })
              }}
              type="checkbox"
              className="toggle ml-auto toggle-warning toggle-sm"
              defaultChecked
            />
          </div>
          <div className="divider my-0 col-span-2" />
        </>
      )}
      <label className="text-xs font-bold">Type</label>
      <div className="flex flex-col   w-full  gap-2">
        <select
          defaultValue={currentGlb?.type || "npc"}
          onChange={(e) => updateGlb({ type: e.target.value as "npc" | "misc" | "hero" })}
          className="select outline-none focus:outline-none outline rounded-none select-bordered select-xs"
        >
          <option value="npc">npc</option>
          <option value="misc">misc</option>
        </select>
      </div>
      <div className="divider my-0 col-span-2" />
      <label className="text-xs font-bold">Shown time:</label>
      <div className="max-h-40 overflow-auto grid gap-2 grid-cols-2">
        {["morning", "noon", "afternoon", "evening", "night"].map((time) => (
          <div className="flex px-2 gap-2 w-full" key={time}>
            <input
              checked={currentGlb?.shownTime[time as keyof GLBType["shownTime"]]}
              type="checkbox"
              onChange={(e) => {
                updateGlb({
                  shownTime: {
                    ...currentGlb?.shownTime,
                    [time]: e.target.checked,
                  },
                })
              }}
              id={time}
              className="checkbox rounded-none checkbox-xs w-fit"
            />
            <label htmlFor={time} className="text-xs label-text w-fit">
              {time}
            </label>
          </div>
        ))}
      </div>
      <div className="divider my-0 col-span-2" />
      <label className=" text-xs font-bold mb-2">Scale: {currentGlb?.scale[0] ?? 1}</label>
      <input
        type="range"
        value={currentGlb?.scale[0]}
        min={0}
        max={20}
        step={0.1}
        onChange={(e) => updateGlb({ scale: [+e.target.value, +e.target.value, +e.target.value] })}
        className="range range-xs w-full"
      />
      {animations.length > 0 && (
        <>
          <div className="divider my-0 col-span-2" />
          <label className=" text-xs font-bold mb-2">Animations</label>
          {animationSet.map((action) => (
            <div key={action} className="grid grid-cols-3 gap-2">
              <span className="text-xs">{action}</span>
              <select
                value={currentGlb?.animationSet?.[action]}
                onChange={(e) => {
                  const animation = currentGlb?.animationSet ?? {}
                  updateGlb({
                    animationSet: {
                      ...animation,
                      [action]: e.target.value,
                    },
                  })
                }}
                className="select rounded-none select-bordered w-full select-xs"
              >
                <option value={undefined}>None</option>
                {animations.map((k) => (
                  <option key={k.uuid} value={k.name}>
                    {k.name}:
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  const currentGlbAnimation = currentGlb?.currentAnimation

                  const currentAnimation =
                    currentGlbAnimation === currentGlb?.animationSet?.[action]
                      ? undefined
                      : currentGlb?.animationSet?.[action]
                  store.updateGlb({ ...currentGlb, currentAnimation })
                }}
                className={cn("btn btn-outline rounded-none border-opacity-10 border-white btn-xs", {
                  "btn-warning": currentGlb?.currentAnimation === currentGlb?.animationSet?.[action],
                })}
              >
                {currentGlb?.animationSet?.[action] &&
                currentGlb?.currentAnimation === currentGlb?.animationSet?.[action]
                  ? "Stop"
                  : "Play"}
              </button>
            </div>
          ))}
        </>
      )}

      {currentGlb.type !== "hero" && (
        <>
          <div className="divider my-0 col-span-2" />

          <label className=" text-xs font-bold  mb-2">Dialogue: </label>
          <textarea
            placeholder="This is a dialogue. You can write anything you want to show in the dialogue"
            value={currentGlb?.dialogue?.content}
            onChange={(e) =>
              updateGlb({
                ...currentGlb,
                dialogue: {
                  ...currentGlb.dialogue,
                  content: e.target.value,
                },
              })
            }
            className="textarea placeholder:text-white placeholder:text-opacity-35 textarea-bordered rounded-none border-white border-opacity-10 w-full"
          />

          {currentGlb.dialogue?.choices?.map((choice) => <Option {...choice} key={choice.uuid} />)}
          <button
            onClick={() => {
              const currentChoices = currentGlb?.dialogue?.choices ?? []
              const uuid = new THREE.Object3D().uuid
              updateGlb({
                ...currentGlb,
                dialogue: {
                  ...currentGlb.dialogue,
                  choices: [
                    ...currentChoices,
                    {
                      label: "Option" + currentChoices.length,
                      requiredMoney: undefined,
                      requiredItem: undefined,
                      requiredEnergy: undefined,
                      reward: undefined,
                      parent: currentGlb.uuid,
                      uuid,
                    },
                  ],
                },
              })
            }}
            className="btn mb-4 btn-outline btn-warning btn-xs rounded-none border-white border-opacity-10 mt-2"
          >
            Add choice
          </button>
        </>
      )}
    </div>
  )
}
