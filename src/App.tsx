import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Game from "./components/Game";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Game />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
