import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/Authentication';

const ManageEvents = () => {
    const [clubs, setClubs] = useState([])
    const [events, setEvents] = useState([])
    const [uni, setUnis] = useState([])
    const { user } = useContext(AuthContext)
    useEffect(() => {
        axios.get('https://club-event-management-server.vercel.app/event')
            .then(res => {
                setEvents(res.data)
            })
        axios.get('https://club-event-management-server.vercel.app/club')
            .then(res => {
                setClubs(res.data)
            })
        axios.get('https://club-event-management-server.vercel.app/uni')
            .then(res => {
                setUnis(res.data)
            })
    }, [])
    const userCLubs = clubs.filter(c => c?.clubAdminEmail === user?.email);
    const clubIds = userCLubs.map(c => c._id)
    console.log(userCLubs, clubIds);

    const getEvent = events.filter(e => clubIds.includes(e?.clubId));
    console.log(getEvent);

    return (
      <div className="p-6 bg-white min-h-screen">
  {userCLubs.length > 0 && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      {userCLubs.map(c => (
        <div
          key={c._id}
          className="bg-purple-100 border-l-8 border-purple-500 rounded-2xl p-6 shadow-md"
        >
          <h1 className="text-xl font-bold text-purple-800 mb-2">Club Name: {c.name}</h1>
          <h1 className="text-md text-purple-700 mb-1">Club Type: {c.type}</h1>
          <h1 className="text-md text-purple-700">University: {uni.find(u => u._id === c.universityId)?.name}</h1>
        </div>
      ))}
    </div>
  )}

  {getEvent.length > 0 && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {getEvent.map(e => (
        <div
          key={e._id}
          className="bg-white border border-purple-300 rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-purple-800 mb-2">{e.name}</h2>
          <div className="text-purple-700 space-y-1">
            <h1>Manager: {e.eventManageEmail}</h1>
            <h1>Type: {e.eventType}</h1>
            <h1>Location: {e.location}</h1>
            <h1>Deadline: {e.deadline}</h1>
            <h1>Date: {e.eventDate}</h1>
            <h1>Prize Money: {e.prizeMoney}</h1>
            <h1>Registration Link: <a href={e.registrationLink} className="underline text-purple-600">{e.registrationLink}</a></h1>
            <h1>Fee: {e.registrationFee}</h1>
            <h1>Process: {e.registrationProcess}</h1>
            <h1>Status: <span className={`font-semibold ${e.status === 'Open' ? 'text-green-600' : 'text-red-600'}`}>{e.status}</span></h1>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

    );
};

export default ManageEvents;