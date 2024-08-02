import { getClientPb } from "@/lib/pb"
import { Link } from "react-router-dom"

export function Main() {
  const games = [
    {
      title: "Game 1",
      description: "Description for game 1",
      image: "https://via.placeholder.com/150",
    },
    {
      title: "Game 2",
      description: "Description for game 2",
      image: "https://via.placeholder.com/150",
    },
    {
      title: "Game 3",
      description: "Description for game 3",
      image: "https://via.placeholder.com/150",
    },
  ]

  const pb = getClientPb()
  pb.collection("Games")
    .getFullList()
    .then((res) => {
      console.log(res)
    })

  return (
    <div>
      <main className="min-h-screen bg-base-300 p-4">
        <div className="w-full shadow flex items-center justify-between">
          <img src="logo.svg" alt="Vxlverse Logo" className="w-16 h-16" />
          <Link to={`/editor`}>
            <button className="btn btn-sm btn-primary">Create your Own Game</button>
          </Link>
        </div>
        <div className="divider" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2  md:grid-cols-3  xl:grid-cols-3 2xl:grid-cols-5">
          {games.map((game, index) => (
            <Link key={game.title} to={`/${game.title}`}>
              <div className="card  bg-base-100 w-full  shadow-xl">
                <figure className="bg-black  h-60 ">
                  <img src="/bg-game.png" alt="Shoes" className="object-scale-down opacity-40 h-full" />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">
                    Shoes!
                    <div className="badge badge-secondary">NEW</div>
                  </h2>
                  <p>If a dog chews shoes whose shoes does he choose?</p>
                  <div className="card-actions justify-end">
                    <div className="badge badge-outline">Fashion</div>
                    <div className="badge badge-outline">Products</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
