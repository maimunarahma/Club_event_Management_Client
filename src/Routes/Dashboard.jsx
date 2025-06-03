import { Home, CalendarDays, Trophy, Users, Settings, LogOut } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../providers/Authentication';
import axios from 'axios';


const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [allProfiles, setAllProfiles] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:5000/users').then(res => { setAllProfiles(res.data) })
  }, [])
  const getProfiler = (email) => {
    return allProfiles.find(p => p?.email === email) || { name: "Unknown User" };
  }
  return (
    <div className='flex '>
      <div className="w-64 h-screen bg-white shadow-md p-4 space-y-6">
        <h2 className="text-2xl font-bold text-center text-blue-600">{getProfiler(user?.email)?.role}</h2>
        <nav className="flex flex-col gap-4 text-gray-700 font-medium">
          <Link to="/dashboard" className="hover:text-blue-600 flex items-center gap-2">
            <Home size={20} /> Dashboard Home
          </Link>
          <Link to="/dashboard/events" className="hover:text-blue-600 flex items-center gap-2">
            <CalendarDays size={20} /> Manage Events
          </Link>
          <Link to="/dashboard/champions" className="hover:text-blue-600 flex items-center gap-2">
            <Trophy size={20} /> Champions List
          </Link>
          <Link to="/dashboard/participants" className="hover:text-blue-600 flex items-center gap-2">
            <Users size={20} /> Participants
          </Link>
          <Link to="/dashboard/settings" className="hover:text-blue-600 flex items-center gap-2">
            <Settings size={20} /> Settings
          </Link>
          <Link to="/logout" className="hover:text-red-600 flex items-center gap-2 mt-auto">
            <LogOut size={20} /> Logout
          </Link>
        </nav>


      </div>
      {
        getProfiler(user?.email)?.role === 'super_admin' && (
          <div className='flex flex-col w-full'>
            <div className='flex items-center w-full justify-between p-4 bg-blue-600 text-white'>
                     <h3 className="w-1/5 text-xl font-semibold">Name</h3>
                <p className="w-1/5 text-xl font-semibold ">Email</p>
                <p className="w-1/5 text-xl font-semibold">Role</p>
                  <p className="w-1/5 text-xl font-semibold">Update</p>
                    <p className="w-1/5 text-xl font-semibold">Delete</p>
                </div>
            {allProfiles.map(p => (
              
              <div key={p._id} className="p-4 bg-gray-100 rounded-md flex   items-center gap-4 border-b">
              
                
                <div className='flex w-full justify-between p-4 items-center '>
                <h3 className="w-1/5 text-lg font-semibold">{p.name}</h3>
                <p className="w-1/5 text-lg font-semibold">{p.email}</p>
                <p className="w-1/5 text-lg font-semibold">{p.role}</p>
                <p className='w-1/5'>
  <button className='btn '>Update</button>
                </p>
               <p className='w-1/5'>
                                <button className='btn '>Delete</button>
                                </p>

                </div>
                </div>
        
            ))}
          </div>
        )
      }
    </div>
  );
};

export default Dashboard;