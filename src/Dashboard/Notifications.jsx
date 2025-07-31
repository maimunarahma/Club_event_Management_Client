import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/Authentication';

const Notifications = () => {
    const [allInvited,setAllinvited]=useState([])
      const {user}=useContext(AuthContext)
  useEffect(()=>{
    axios.get('https://club-event-management-server.vercel.app/invite') .then(res=> { console.log("📦 All invited data:", res.data); setAllinvited(res.data)})
  },[])
 
  const notifyFor=()=>{
    console.log(allInvited.length, user?.email,  allInvited.map(i=>i?.result?.email))
    return allInvited.filter(i=> i?.result?.email===user?.email)
  }
  console.log(notifyFor(), allInvited);
  const myInvites=notifyFor()
  console.log(myInvites);
    return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-purple-600">🔔 Notifications</h2>
      {myInvites.length > 0 ? (
        <ul className="space-y-3">
          {myInvites.map((invite, index) => (
            <li key={index} className="p-4 bg-gray-100 rounded">
              You are invited as <strong>{invite?.invitedAs}</strong> to the event: <strong>{invite?.event}</strong> of the club <strong>{invite?.club}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No invitations at the moment.</p>
      )}
    </div>
    );
};

export default Notifications;