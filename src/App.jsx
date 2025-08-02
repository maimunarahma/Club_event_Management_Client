import { Outlet } from "react-router-dom"
import Nav from "./Common/Nav"

function App() {


  return (
    <div className="w-auto mx-auto">
   <Nav/>
   <Outlet/>

      
    </div>
  )
}

export default App
