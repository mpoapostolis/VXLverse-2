import { useGames } from "@/hooks/useGames"
import { getClientPb } from "@/lib/pb"
import { cn } from "@/lib/utils"
import { Link, useNavigate } from "react-router-dom"

export const genres = [
  "Drama",
  "Horror",
  "Happy",
  "Sad",
  "Romantic",
  "Mystery",
  "Fantasy",
  "Sci-Fi",
  "Thriller",
  "Comedy",
  "Adventure",
  "Action",
  "Survival",
  "Psychological",
  "Dark",
  "Light-hearted",
  "Epic",
  "Nostalgic",
  "Melancholic",
  "Suspense",
  "Tragic",
  "Hopeful",
  "Whimsical",
  "Eerie",
  "Exciting",
  "Emotional",
  "Uplifting",
  "Inspirational",
  "Heroic",
  "Post-apocalyptic",
  "Cyberpunk",
  "Steampunk",
  "Gothic",
  "Noir",
  "Slice of Life",
  "Paranormal",
  "Supernatural",
  "Historical",
  "Retro",
  "Magical",
  "Absurd",
  "Satirical",
  "Heartwarming",
  "Chilling",
  "Mysterious",
  "Grim",
  "Cheerful",
  "Lighthearted",
]

export function Main() {
  const pb = getClientPb()

  const isLogged = pb?.authStore?.isValid
  const { data: games, mutate } = useGames(0)

  const navigate = useNavigate()

  return (
    <div key={isLogged.toString()}>
      <main className="min-h-screen bg-base-300 p-4">
        <div className="w-full shadow flex items-center">
          <img src="logo.svg" alt="Vxlverse Logo" className="w-16 h-16 mr-auto" />
          {isLogged && (
            <>
              <label htmlFor="my_modal_6" className="btn btn-sm btn-ghost">
                Create your game
              </label>
              <input type="checkbox" id="my_modal_6" className="modal-toggle " />
              <div className="modal" role="dialog">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    const form = e.target as HTMLFormElement
                    const formData = new FormData(form)
                    const myId = pb.authStore?.model?.id
                    formData.append("owner", myId)
                    const data = Object.fromEntries(formData.entries())
                    const game = await pb.collection("games").create(data)
                    navigate(`editor/${game.id}`)
                  }}
                  className="modal-box"
                >
                  <h3 className="text-lg font-bold">Create your own Game</h3>
                  <div className="divider my-0" />
                  <div className="form-control mb-2">
                    <label className="label">
                      <span className="label-text">Name</span>
                    </label>
                    <input required name="name" type="text" placeholder="Game Name" className="input input-bordered" />
                  </div>
                  <div className="form-control mb-2">
                    <label className="label">
                      <span className="label-text">Description</span>
                    </label>
                    <textarea
                      required
                      name="description"
                      placeholder="Game Description"
                      className="textarea textarea-bordered"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Genre</span>
                    </label>
                    <select required name="genre" defaultValue={undefined} className="select select-bordered w-full">
                      <option disabled>Select a genre </option>
                      {genres.map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="modal-action">
                    <input type="submit" className="btn btn-ghost" />
                  </div>
                </form>
                <label className="modal-backdrop" htmlFor="my_modal_6">
                  Close
                </label>
              </div>
            </>
          )}
          {isLogged && (
            <button
              onClick={async () => {
                pb.authStore.clear()
                mutate()
              }}
              className="btn btn-sm btn-ghost"
            >
              Logout
            </button>
          )}
          {!isLogged && (
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                await pb.collection("users").authWithOAuth2({
                  provider: "google",
                })
              }}
            >
              <button type="submit" className="flex w-full items-center justify-center  btn-sm btn-ghost gap-3.5 ">
                <span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_191_13499)">
                      <path
                        d="M19.999 10.2217C20.0111 9.53428 19.9387 8.84788 19.7834 8.17737H10.2031V11.8884H15.8266C15.7201 12.5391 15.4804 13.162 15.1219 13.7195C14.7634 14.2771 14.2935 14.7578 13.7405 15.1328L13.7209 15.2571L16.7502 17.5568L16.96 17.5774C18.8873 15.8329 19.9986 13.2661 19.9986 10.2217"
                        fill="#4285F4"
                      />
                      <path
                        d="M10.2055 19.9999C12.9605 19.9999 15.2734 19.111 16.9629 17.5777L13.7429 15.1331C12.8813 15.7221 11.7248 16.1333 10.2055 16.1333C8.91513 16.1259 7.65991 15.7205 6.61791 14.9745C5.57592 14.2286 4.80007 13.1801 4.40044 11.9777L4.28085 11.9877L1.13101 14.3765L1.08984 14.4887C1.93817 16.1456 3.24007 17.5386 4.84997 18.5118C6.45987 19.4851 8.31429 20.0004 10.2059 19.9999"
                        fill="#34A853"
                      />
                      <path
                        d="M4.39899 11.9777C4.1758 11.3411 4.06063 10.673 4.05807 9.99996C4.06218 9.32799 4.1731 8.66075 4.38684 8.02225L4.38115 7.88968L1.19269 5.4624L1.0884 5.51101C0.372763 6.90343 0 8.4408 0 9.99987C0 11.5589 0.372763 13.0963 1.0884 14.4887L4.39899 11.9777Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M10.2059 3.86663C11.668 3.84438 13.0822 4.37803 14.1515 5.35558L17.0313 2.59996C15.1843 0.901848 12.7383 -0.0298855 10.2059 -3.6784e-05C8.31431 -0.000477834 6.4599 0.514732 4.85001 1.48798C3.24011 2.46124 1.9382 3.85416 1.08984 5.51101L4.38946 8.02225C4.79303 6.82005 5.57145 5.77231 6.61498 5.02675C7.65851 4.28118 8.9145 3.87541 10.2059 3.86663Z"
                        fill="#EB4335"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_191_13499">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                Sign in with Google
              </button>
            </form>
          )}
        </div>
        <div className="divider my-0" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2  md:grid-cols-3  xl:grid-cols-3 2xl:grid-cols-5">
          {games?.map((game, index) => (
            <div key={game?.id} className="card  bg-base-100 w-full  shadow-xl">
              <figure className="bg-black  h-60 relative ">
                <img src="/bg-game.png" alt="Shoes" className="object-scale-down opacity-40 h-full" />
                <div className="badge-warning absolute right-4 top-4  badge badge-outline">4.1</div>
              </figure>
              <div className="p-4 flex flex-col">
                <h2 className="card-title text-lg mb-2 text-warning flex">
                  {game.name}
                  <span className="badge badge-outline ml-auto badge-primary">{game.genre}</span>
                </h2>
                <p className="text-base-content mb-1  text-sm">{game.description}</p>
                <div className="divider my-0 mb-2" />

                <div
                  className={cn("w-full gap-2 grid", {
                    "grid-cols-3": pb.authStore?.model?.id === game.owner,
                  })}
                >
                  {pb?.authStore?.model?.id === game?.owner && (
                    <>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation()
                          await pb.collection("games").delete(game?.id)
                          mutate()
                        }}
                        className="btn btn-xs btn-outline btn-error w-full"
                      >
                        Delete
                      </button>
                      <Link to={`/editor/${game?.id}`}>
                        <button
                          onClick={async (e) => {
                            e.stopPropagation()
                            navigate(`/editor/${game?.id}`)
                          }}
                          className="btn btn-xs btn-outline btn-info w-full"
                        >
                          Edit
                        </button>
                      </Link>
                    </>
                  )}
                  <Link to={`/${game?.id}`}>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation()
                        navigate(`/${game.id}`)
                      }}
                      className={"btn btn-xs btn-outline btn-warning w-full"}
                    >
                      Play
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
