import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./index.css"
import { Editor } from "./pages/editor.tsx"
import { Game } from "./pages/game.tsx"
import { Main } from "./pages/main.tsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "editor",
    element: <Editor />,
  },
  {
    path: "/:id",
    element: <Game />,
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
