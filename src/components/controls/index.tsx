export function Controls(props: {
  onChangeMode: (mode: "scale" | "rotate" | "translate") => void
  onDelete: () => void
}) {
  return (
    <div className="h-fit w-fit flex bg-black text-lg gap-2 px-2 py-1 rounded">
      <button onClick={() => props.onChangeMode("translate")} className="">
        ↔️
      </button>
      <button onClick={() => props.onChangeMode("rotate")} className="">
        🔄
      </button>
      <button onClick={() => props.onChangeMode("scale")} className="">
        🔍
      </button>
      <button onClick={props.onDelete} className="">
        🗑️
      </button>
    </div>
  )
}
