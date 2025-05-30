import { Home, CalendarDays, Trophy, Users, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';


const Dashboard = () => {
    return (
  <div className="w-64 h-screen bg-white shadow-md p-4 space-y-6">
      <h2 className="text-2xl font-bold text-center text-blue-600">Event Admin</h2>
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
    );
};

export default Dashboard;