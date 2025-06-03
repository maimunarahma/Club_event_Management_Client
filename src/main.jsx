import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';

import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Banner from './Layout/Home/Banner.jsx';
import University from './Routes/Univarsity.jsx';
import Authentication from './providers/Authentication.jsx';
import Dashboard from './Routes/Dashboard.jsx';
import Private from './Routes/Private.jsx';
import Event from './Routes/Event.jsx';
import Participantion from './Routes/Participantion.jsx';
import UniversityGridPage from './Routes/Univarsity.jsx';
import News from './Routes/News.jsx';

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
      },{
        path:'/event/:id',
        element:<Private><Participantion/></Private>
      },{
        path:'/news',
        element:<News/>
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
