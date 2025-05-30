import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';

import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Banner from './Layout/Home/Banner.jsx';
import UniversityGridPage from './Routes/Univarsity.jsx';
import Authentication from './providers/Authentication.jsx';
import Dashboard from './Routes/Dashboard.jsx';
import Private from './Routes/Private.jsx';
import Event from './Routes/Event.jsx';

let router = createBrowserRouter([
  {
    path: "/",
    element:<App/>,
    children:[
      {
        path:'/',
        element:<Banner/>
      },
      {
        path:'/uni',
        element:<UniversityGridPage/>
      },
      {
        path:'/dashboard',
        element:<Private><Dashboard/></Private>
      },{
        path:'/event',
        element:<Event/>
      }
    ]
  },
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Authentication>
 <RouterProvider router={router} />
    </Authentication>
   
  </StrictMode>,
)
