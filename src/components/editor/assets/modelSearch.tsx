import { useEditor } from "@/components/editor/provider"
import { ChangeEvent } from "react"

export function ModelSearch() {
  const { category, changeSearchTerm, isLoading, page, setPage, totalPages } = useEditor()
  return (
    <div className="w-full  border-b h-10 border-opacity-10 border-white sticky p-4 py-2 top-0 flex px-4 items-center gap-2">
      <input
        key={category}
        onChange={(e: ChangeEvent<HTMLInputElement>) => changeSearchTerm(e.target.value)}
        type="text"
        placeholder="🔍   Search...."
        className="input input-xs rounded-none input-bordered mr-auto"
      />

      <button
        className="btn btn-sm text-base-content  btn-link  rounded-none"
        onClick={() => setPage(page - 1)}
        disabled={page === 0}
      >
        Prev
      </button>
      {isLoading ? (
        "Loading..."
      ) : (
        <div className="select-none">
          <div className="font-bold text-xs">{`Page: ${page + 1} of ${totalPages}`}</div>
        </div>
      )}

      <button
        className="btn btn-sm text-base-content  btn-link rounded-none"
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages - 1}
      >
        Next
      </button>
    </div>
  )
}
