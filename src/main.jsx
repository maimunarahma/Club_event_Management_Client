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
import Participant from './ClubAdmin/Participant.jsx';
import DashHome from './Dashboard/DashHome.jsx';
import ManageEvents from './Dashboard/ManageEvents.jsx';
import Settings from './Dashboard/Settings.jsx';
import Notifications from './Dashboard/Notifications.jsx';
import ChatBot from './Routes/ChatBot.jsx';
import SuccessPayment from './SuccessPayment.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NotFound from './Common/NotFound.jsx';
import Club from './Routes/Club.jsx';

const queryClient = new QueryClient();
let router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: '',         // equivalent to '/' at this level
        element: <Banner />,

      },

      {
        path: 'uni',
        element: <UniversityGridPage />
      }, {
        path: 'club',
        element: <Club/>
      },
      {
        path: 'event',
        element: <Event />
      },
      {
        path: 'event/:id',
        element: <Private><Participantion /></Private>
      },
      {
        path: 'news',
        element: <News />
      },
      {
        path: 'success-payment/:trxid',
        element: <SuccessPayment />
      },
      {
        path: 'dashboard',
        element: <Private><Dashboard /></Private>,
        children: [
          {
            path: '',
            element: <Private><DashHome /></Private>
          },

          {
            path: 'participants',
            element: <Private><Participant /></Private>
          },
          {
            path: 'manage-events',
            element: <Private><ManageEvents /></Private>
          },
          {
            path: 'settings',
            element: <Settings />
          },
          {
            path: 'notifications',
            element: <Notifications />
          },
        ]
      },
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Authentication>
        <RouterProvider router={router} />
      </Authentication>
    </QueryClientProvider>
  </StrictMode>,
)
