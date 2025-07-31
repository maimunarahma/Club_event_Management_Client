import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/Authentication';
import axios from 'axios';

const Settings = () => {
      const [activeTab, setActiveTab] = useState("Profile");
      const [allclub,setAllClub]=useState([])

      const {user}=useContext(AuthContext)
    //   console.log(user);
  useEffect(()=>{
    axios.get('https://club-event-management-server.vercel.app/club')
    .then(res=>{
        setAllClub(res.data)
    })
  })
  const club=allclub.find(c=>c?.clubAdminEmail===user?.email)
    return (
     
          <div className="p-6 bg-white w-1/2 min-h-screen text-purple-800">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-purple-300">
        {["Profile", "Club", "Event", "Security"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-lg font-medium ${
              activeTab === tab
                ? "border-b-4 border-purple-600 text-purple-900"
                : "text-purple-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === "Profile" && (
          <div>
            <label className="block font-semibold">Name</label>
            <input
              type="text"
              defaultValue={user?.dispalyName}
              className="w-full border border-purple-300 rounded-xl px-4 py-2"
            />

            <label className="block mt-4 font-semibold">Email</label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="w-full bg-gray-100 border border-purple-200 rounded-xl px-4 py-2"
            />

            <button className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-xl">
              Update Profile
            </button>
          </div>
        )}

        {activeTab === "Club" && (
          <div>
            <label className="block font-semibold">Club Name</label>
            <input
              type="text"
              defaultValue={club?.name}
              className="w-full border border-purple-300 rounded-xl px-4 py-2"
            />

            <label className="block mt-4 font-semibold">Club Type</label>
            <input
              type="text"
              defaultValue={club?.type}
              className="w-full border border-purple-300 rounded-xl px-4 py-2"
            />

            <label className="block mt-4 font-semibold">University</label>
            <input
              type="text"
              value={club?.universityName}
              disabled
              className="w-full bg-gray-100 border border-purple-200 rounded-xl px-4 py-2"
            />

            <button className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-xl">
              Update Club Info
            </button>
          </div>
        )}

        {activeTab === "Event" && (
          <div>
            <label className="block font-semibold">Default Location</label>
            <input
              type="text"
              placeholder="e.g. University Hall"
              className="w-full border border-purple-300 rounded-xl px-4 py-2"
            />

            <label className="block mt-4 font-semibold">Default Registration Fee</label>
            <input
              type="number"
              placeholder="e.g. 100"
              className="w-full border border-purple-300 rounded-xl px-4 py-2"
            />

            <label className="block mt-4 font-semibold">Auto Approve Registrations</label>
            <select className="w-full border border-purple-300 rounded-xl px-4 py-2">
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>

            <button className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-xl">
              Save Event Settings
            </button>
          </div>
        )}

        {activeTab === "Security" && (
          <div>
            <label className="block font-semibold">New Password</label>
            <input
              type="password"
              className="w-full border border-purple-300 rounded-xl px-4 py-2"
            />

            <label className="block mt-4 font-semibold">Confirm Password</label>
            <input
              type="password"
              className="w-full border border-purple-300 rounded-xl px-4 py-2"
            />

            <button className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-xl">
              Change Password
            </button>
          </div>
        )}
      </div>
    </div>  
        
    );
};

export default Settings;