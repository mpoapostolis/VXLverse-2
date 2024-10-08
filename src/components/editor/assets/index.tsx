import { TreeFile, TreeFolder } from "@/components/tree"
import { cn } from "@/lib/utils"
import { useEditor } from "../provider"
import { ModelGrid } from "./modelGrid"
import { ModelSearch } from "./modelSearch"

const categories: string[] = [
  "Scenes & Levels",
  "Nature",
  "Weapons",
  "People & Characters",
  "Objects",
  "Transport",
  "Buildings",
  "Other",
  "Food & Drink",
  "Buildings (Architecture)",
  "Animals",
  "Furniture & Decor",
  "Clutter",
]

export function Assets(props: { id?: string }) {
  const { setPage, category, setCategory, assetCategory, setAssetCategory } = useEditor()

  return (
    <div className={cn("w-full h-full  border-t border-white border-opacity-10")}>
      <div className="flex w-full overflow-hidden h-full">
        <div>
          <button className="h-10 w-full text-left border-l-0 hover:bg-base-300 border-b pl-4 p-2 text-sm  font-semibold border-r border-white border-opacity-10">
            Assets
          </button>

          <ul className="menu menu-xs  h-full  bg-base-200 border-r border-opacity-10 border-white max-w-60 min-w-60">
            <li>
              <TreeFolder
                onClick={() => {
                  setCategory("Library")
                }}
                selected={assetCategory === "Library"}
              >
                Library
              </TreeFolder>

              <ul>
                {categories.map((cat) => (
                  <TreeFile
                    key={cat}
                    onClick={() => {
                      setAssetCategory("Library")
                      setPage(0)
                      setCategory(cat)
                    }}
                    selected={cat === category}
                  >
                    {cat}
                  </TreeFile>
                ))}
              </ul>
            </li>
          </ul>
        </div>
        <div className="h-full overflow-hidden w-full">
          <ModelSearch />
          <div className="overflow-auto  h-[80vh] w-full">
            <ModelGrid />
          </div>
        </div>
      </div>
    </div>
  )
}
