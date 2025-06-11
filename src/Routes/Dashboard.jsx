
import { Outlet } from 'react-router-dom';
import DashNav from '../Common/DashNav';


const Dashboard = () => {
 
  return (
    <div className='flex flex-col md:flex-row'>
   <DashNav/>
   <Outlet/>
    </div>
  );
};

export default Dashboard;