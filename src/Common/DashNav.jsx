import React, { useContext, useEffect, useState } from 'react';
import { Home, CalendarDays, Trophy, Users, Settings, LogOut ,Bell} from 'lucide-react';
import { AuthContext } from '../providers/Authentication';
import axios from 'axios';
import { Link } from 'react-router-dom';


const DashNav = () => {
    const { user ,signOutUser } = useContext(AuthContext)
      const [allProfiles, setAllProfiles] = useState([]);
      useEffect(() => {
        axios.get('http://localhost:5000/users').then(res => { setAllProfiles(res.data) })
      }, [])
      const getProfiler = (email) => {
        return allProfiles.find(p => p?.email === email) || { name: "Unknown User" };
      }
    return (
          <div className="w-64 h-screen bg-white shadow-md p-4 space-y-6">
               <h2 className="text-2xl font-bold text-center text-blue-600">{getProfiler(user?.email)?.role}</h2>
               <nav className="flex flex-col gap-4 text-gray-700 font-medium">
                 <Link to="/dashboard" className="hover:text-blue-600 flex items-center gap-2">
                   <Home size={20} /> Dashboard Home
                 </Link>
                 {
                 ( getProfiler(user?.email)?.role!=='general_user' && getProfiler(user?.email)?.role!=='event_manager') && (
                    <div className='flex flex-col gap-3'>
                   <Link to="/dashboard/manage-events" className="hover:text-blue-600 flex items-center gap-2">
                   <CalendarDays size={20} /> Manage Events
                 </Link>
                 <Link to="/dashboard/champions" className="hover:text-blue-600 flex items-center gap-2">
                   <Trophy size={20} /> Champions List
                 </Link>
                 <Link to="/dashboard/participants" className="hover:text-blue-600 flex items-center gap-2">
                   <Users size={20} /> Participants
                 </Link>
                 </div>
                  )
                 }
               
                 <Link to="/dashboard/settings" className="hover:text-blue-600 flex items-center gap-2">
                   <Settings size={20} /> Settings
                 </Link>
                 <Link to="/logout" className="hover:text-red-600 flex items-center gap-2 mt-auto">
                  <button onClick={()=>signOutUser()} className='flex justify-start items-center gap-3'><LogOut size={20} /> Logout</button> 
                 </Link>
                 <Link to='/dashboard/notifications' className="hover:text-blue-600 flex items-center gap-2"><Bell size={20}/>Notifications</Link>
               </nav>
       
       
             </div>
    );
};

export default DashNav;