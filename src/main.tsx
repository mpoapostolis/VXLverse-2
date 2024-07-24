import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "./App.tsx"
import Editor from "./Editor.tsx"
import "./index.css"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "editor",
    element: <Editor />,
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
