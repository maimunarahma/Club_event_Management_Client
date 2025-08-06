import { Outlet } from "react-router-dom"
import Nav from "./Common/Nav"
import Footer from "./Common/Footer"

function App() {


  return (
    <div className="w-auto mx-auto">
   <Nav/>
   <Outlet/>
   <Footer/>
      
    </div>
  )
}

export default App
