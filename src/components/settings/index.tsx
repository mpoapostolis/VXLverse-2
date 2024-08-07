import { useGameConfigStore } from "@/lib/game-store"
import { GLBType } from "@/lib/store"
import { cn } from "@/lib/utils"
import { useGLTF } from "@react-three/drei"

const actions = ["idle", "walk", "run", "jump", "jumpIdle", "jumpLand", "fall"]

// function Option(props: { idx: number; selected?: boolean } & Choice) {
//   const store = useStore()
//   const updateChoice = (choice: Partial<Choice>) => store.updateChoice({ ...props, ...choice })
//   return (
//     <div
//       className={cn(
//         " grid grid-cols-[90px_1fr] transition duration-1000 h-full  border-white border-opacity-10 border p-2 bg-base-100",
//         {
//           "h-10 overflow-hidden ": !props.selected,
//         },
//       )}
//     >
//       <label className="text-xs font-bold">Option {props.idx}</label>
//       <input
//         defaultValue={props.label}
//         onChange={(e) => updateChoice({ label: e.target.value })}
//         placeholder="option"
//         className="input placeholder:text-gray-600 rounded-none input-bordered border-r  w-full input-xs"
//       />

//       <label className="text-xs font-bold">Req Money:</label>
//       <input
//         min={0}
//         defaultValue={props.requiredMoney}
//         onChange={(e) => updateChoice({ requiredMoney: parseInt(e.target.value) })}
//         placeholder="80$"
//         type="number"
//         className="input placeholder:text-gray-600 rounded-none input-bordered border-r  w-full input-xs"
//       />

//       <label className="text-xs font-bold">Req Item:</label>
//       <select
//         onChange={(e) => {
//           updateChoice({ requiredItem: e.target.value })
//         }}
//         value={props?.requiredItem}
//         className="select rounded-none select-bordered w-full select-xs"
//       >
//         <option value={undefined}>None</option>
//         {store.glbs.map((k) => (
//           <option key={k.uuid} value={k.uuid}>
//             {k.name}
//           </option>
//         ))}
//       </select>

//       <label className="text-xs font-bold">Req Energy:</label>
//       <input
//         min={0}
//         max={100}
//         defaultValue={props.requiredEnergy}
//         onChange={(e) => updateChoice({ requiredEnergy: parseInt(e.target.value) })}
//         placeholder="65"
//         type="number"
//         className="input placeholder:text-gray-600 rounded-none input-bordered border-r  w-full input-xs"
//       />

//       <label className="text-xs font-bold">Reward</label>
//       <div className="grid grid-cols-2 gap-2">
//         <select
//           value={props.reward?.type}
//           onChange={(e) => {
//             updateChoice({ reward: { type: e.target.value as "money" | "energy" | "item" } })
//           }}
//           className="select rounded-none select-bordered w-full select-xs"
//         >
//           <option value={undefined}>None</option>
//           {["item", "money", "energy"].map((k) => (
//             <option key={k}>{k}</option>
//           ))}
//         </select>
//         <input
//           onChange={(e) => {
//             updateChoice({
//               reward: {
//                 type: props.reward?.type,
//                 amount: undefined,
//                 item: undefined,
//                 [props.reward?.type === "item" ? "item" : "amount"]: props.reward.item
//                   ? e.target.value
//                   : parseInt(e.target.value),
//               },
//             })
//           }}
//           defaultValue={props.reward?.type === "item" ? props.reward?.item : props.reward?.amount}
//           key={props.reward?.type}
//           type={props.reward?.type === "item" ? "text" : "number"}
//           className="input placeholder:text-gray-600 rounded-none input-bordered  w-full input-xs"
//         />
//       </div>
//       <div />
//       <button
//         onClick={() => store.removeChoice(props)}
//         className="btn rounded-none btn-xs w-full btn-error btn-outline btn-square"
//       >
//         Delete
//       </button>
//     </div>
//   )
// }

export function Settings(props: GLBType) {
  const store = useGameConfigStore()

  // const [selectedOption, setSelectedOption] = useState<string>()

  // function createOption() {
  //   const uuid = new Object3D().uuid
  //   store.addChoice({
  //     parent: props.uuid,
  //     uuid: uuid,
  //     label: "Option",
  //   })
  //   setSelectedOption(uuid)
  // }

  const updateGlb = (glb: Partial<GLBType>) => store.updateGlb({ ...props, ...glb })
  const { animations } = useGLTF(props.url)
  console.log(animations)
  return (
    <div className={cn("px-4 flex flex-col  gap-2 mt-4", {})}>
      <label className="text-xs font-bold">Type</label>
      <div className="flex flex-col   w-full  gap-2">
        <select className="select outline-none focus:outline-none outline rounded-none select-bordered select-xs">
          <option value="none">None</option>
          {["npc", "misc", "hero"].map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </div>
      <div className="divider my-0 col-span-2" />
      <label className="text-xs font-bold">Shown time:</label>
      <div className="max-h-40 overflow-auto grid gap-2 grid-cols-2">
        {["morning", "noon", "afternoon", "evening", "night"].map((time) => (
          <div className="flex px-2 gap-2 w-full" key={time}>
            <input
              checked={props?.shownTime[time as keyof GLBType["shownTime"]]}
              type="checkbox"
              onChange={(e) => {
                updateGlb({
                  shownTime: {
                    ...props?.shownTime,
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
      {animations.length > 0 && (
        <>
          <div className="divider my-0 col-span-2" />
          <label className=" text-xs font-bold mb-2">Animations</label>
          {actions.map((action) => (
            <div key={action} className="grid grid-cols-3 gap-2">
              <span className="text-xs">{action}</span>
              <select
                onChange={(e) => {
                  updateGlb({ requiredItem: e.target.value })
                }}
                className="select rounded-none select-bordered w-full select-xs"
              >
                <option value={undefined}>None</option>
                {animations.map((k) => (
                  <option key={k.uuid} value={k.uuid}>
                    {k.name}:
                  </option>
                ))}
              </select>
              <button className="btn btn-ghost btn-xs">Play</button>
            </div>
          ))}
        </>
      )}
      <div className="divider my-0 col-span-2" />
      <label className="text-xs font-bolditems-start ">Required item:</label>
      <div className="">
        <select
          onChange={(e) => {
            updateGlb({ requiredItem: e.target.value })
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
      </div>
    </div>
  )
}
