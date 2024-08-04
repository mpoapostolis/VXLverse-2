import { Choice, GLBType, useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Object3D } from "three"

function Option(props: { idx: number; selected?: boolean } & Choice) {
  const store = useStore()
  const updateChoice = (choice: Partial<Choice>) => store.updateChoice({ ...props, ...choice })
  return (
    <div
      className={cn(
        " grid grid-cols-[90px_1fr] transition duration-1000 h-full  border-white border-opacity-10 border p-2 bg-base-100",
        {
          "h-10 overflow-hidden ": !props.selected,
        },
      )}
    >
      <label className="label  text-xs ">Option {props.idx}</label>
      <input
        defaultValue={props.label}
        onChange={(e) => updateChoice({ label: e.target.value })}
        placeholder="option"
        className="input placeholder:text-gray-600 rounded-none input-bordered border-r  w-full input-xs"
      />

      <label className="label  text-xs ">Req Money:</label>
      <input
        min={0}
        defaultValue={props.requiredMoney}
        onChange={(e) => updateChoice({ requiredMoney: parseInt(e.target.value) })}
        placeholder="80$"
        type="number"
        className="input placeholder:text-gray-600 rounded-none input-bordered border-r  w-full input-xs"
      />

      <label className="label  text-xs ">Req Item:</label>
      <select
        onChange={(e) => {
          updateChoice({ requiredItem: e.target.value })
        }}
        value={props?.requiredItem}
        className="select rounded-none select-bordered w-full select-xs"
      >
        <option value={undefined}>None</option>
        {store.glbs.map((k) => (
          <option key={k.uuid} value={k.uuid}>
            {k.name}
          </option>
        ))}
      </select>

      <label className="label  text-xs ">Req Energy:</label>
      <input
        min={0}
        max={100}
        defaultValue={props.requiredEnergy}
        onChange={(e) => updateChoice({ requiredEnergy: parseInt(e.target.value) })}
        placeholder="65"
        type="number"
        className="input placeholder:text-gray-600 rounded-none input-bordered border-r  w-full input-xs"
      />

      <label className="label  text-xs ">Reward</label>
      <div className="grid grid-cols-2 gap-2">
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
          className="input placeholder:text-gray-600 rounded-none input-bordered  w-full input-xs"
        />
      </div>
      <div />
      <button
        onClick={() => store.removeChoice(props)}
        className="btn rounded-none btn-xs w-full btn-error btn-outline btn-square"
      >
        Delete
      </button>
    </div>
  )
}
export function Settings() {
  const store = useStore()
  const uuid = store?.selectedGlb
  const current = store.glbs.find((glb) => glb?.uuid === uuid)

  const [selectedOption, setSelectedOption] = useState<string>()

  function createOption() {
    const uuid = new Object3D().uuid
    store.addChoice({
      parent: current.uuid,
      uuid: uuid,
      label: "Option",
    })
    setSelectedOption(uuid)
  }

  const updateGlb = (glb: Partial<GLBType>) => store.updateGlb({ ...current, ...glb })

  return (
    <div className={cn("p-4 flex flex-col  gap-2  text-xs items-start ", {})}>
      <div>Name:</div>
      <input
        type="text"
        defaultValue={current?.name}
        onChange={(e) => {
          updateGlb({ name: e.target.value })
        }}
        placeholder="Type here"
        className="input input-bordered input-xs w-full max-w-xs"
      />
      <div className="divider my-0 col-span-2" />
      <label className="label text-xs ">Dialogue</label>
      <div className="flex flex-col   w-full  gap-2">
        <textarea
          onChange={(e) => {
            updateGlb({ dialogue: { content: e.target.value } })
          }}
          defaultValue={current?.dialogue?.content}
          className="textarea text-xs block rounded-none textarea-bordered w-full"
        />
        {store.choices
          .filter((e) => e.parent === current?.uuid)
          .map((obj, idx) => (
            <div key={obj.uuid} onClick={() => setSelectedOption(obj?.uuid)}>
              <Option {...obj} idx={idx} selected={obj.uuid === selectedOption} />
            </div>
          ))}
        <button
          onClick={createOption}
          className="btn rounded-none border-white border-opacity-15 btn-xs w-full btn-outline col-span-2 btn-square"
        >
          Add option
        </button>
      </div>
      <div className="divider my-0 col-span-2" />
      <label className="label  text-xs ">Shown time:</label>
      <div className="max-h-40 overflow-auto grid gap-2 grid-cols-2">
        {["morning", "noon", "afternoon", "evening", "night"].map((time) => (
          <div className="flex px-2 gap-2 w-full" key={time}>
            <input
              checked={current?.shownTime[time as keyof GLBType["shownTime"]]}
              type="checkbox"
              onChange={(e) => {
                updateGlb({
                  shownTime: {
                    ...current?.shownTime,
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
      <label className="label  text-xs items-start ">Required item:</label>
      <div className="">
        <select
          onChange={(e) => {
            updateGlb({ requiredItem: e.target.value })
          }}
          value={current?.requiredItem}
          className="select rounded-none select-bordered w-full select-xs"
        >
          <option value={undefined}>None</option>
          {store.glbs.map((k) => (
            <option key={k.uuid} value={k.uuid}>
              {k.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
