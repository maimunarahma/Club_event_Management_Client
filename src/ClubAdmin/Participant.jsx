import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../providers/Authentication';
import useProfile from '../Routes/getProfile';
// import { filteredEvents } from '../Routes/Event';

const Participant = () => {
    // console.log(filteredEvents);
    const [participants, setParticipants] = React.useState([]);
    const [events, setEvents] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [unis, setUnis] = useState([]);
    const [pay,setPay]=useState([])
    const [allProfiles, setAllProfiles] = useState([]);
    const { user } = useContext(AuthContext);
    let filteredEvents = [];
    
    const profile=useProfile(user?.email)
    console.log(profile)
    useEffect(() => {

        axios.get('https://club-event-management-server.onrender.com/event').then(res => setEvents(res.data));

        axios.get('https://club-event-management-server.onrender.com/club').then(res => setClubs(res.data));
        axios.get('https://club-event-management-server.onrender.com/uni').then(res => setUnis(res.data));
        axios.get('https://club-event-management-server.onrender.com/users').then(res => setAllProfiles(res.data));
          axios.get('https://club-event-management-server.onrender.com/payments').then(res => setPay(res.data));
         axios.get('https://club-event-management-server.onrender.com/participants')
            .then(res => {
                if (res.data) {
                    setParticipants(res.data);
                }
            })
           
    }, []);
  const getClub = (id) => clubs.find(club => club._id === id) || { name: "Unknown Club" };    // const getUni = (id) => unis.find(uni => uni._id === id) || { name: "Unknown University" };
    const getProfile = (email) => allProfiles.find(p => p.email === email) || { name: "Unknown", role: "guest" };
        const currentUserProfile = getProfile(user?.email);
            const isClubAdmin = currentUserProfile.role === 'club_admin';

    if (isClubAdmin) {
        filteredEvents = events.filter(ev => {
            const club = getClub(ev.clubId);
            return club?.clubAdminEmail === user.email;
        })
    }
    else if (getProfile(user?.email).role === 'event_manager') {
        filteredEvents = events.filter(ev => ev.eventManageEmail === user?.email);
    }
    else {
        filteredEvents = events;
    }
console.log(filteredEvents);
//  const 
 const allClubs = filteredEvents.map(event => ({
  eventId: event._id,
  clubId: event.clubId,
  participants: participants?.participants?.filter(p => p.eventId === event._id)
}));

    // console.log(typeof allClubs, allClubs, Array.isArray(allClubs));
      const userCLubs = clubs.filter(c => c?.clubAdminEmail === user?.email);
  const clubIds = userCLubs.map(c => c._id)
    const getEvent = events.filter(e => clubIds.includes(e?.clubId));
    console.log(getEvent)
    return (
    <div className="flex flex-wrap gap-4 p-4 bg-white text-purple-900 w-full">
 
{profile?.role === 'club_admin' && (
  <div className="space-y-6 w-full">
    {getEvent.map((c, i) => (
      <div key={i} className="bg-white shadow-md rounded-lg p-5 border border-purple-200">
        <h2 className="text-lg font-bold text-purple-800 mb-3">Event: {c.name}</h2>
        
        {c?.participants && c.participants.length > 0 ? (
          <div className="space-y-2">
            {c.participants.map((p, j) => (
              <div
                key={`${i}-${j}`}
                className="bg-purple-50 border border-purple-300 rounded-md p-3"
              >
                <p><span className="font-semibold">Email:</span> {p?.email}</p>
                <p><span className="font-semibold">University:</span> {p?.university}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No participants yet.</p>
        )}
      </div>
    ))}
  </div>
)}


  {allClubs.map((club) => (
    <div
      key={club.eventId}
      className="bg-purple-100 rounded-xl shadow-md p-4 w-full md:w-1/2 lg:w-1/3"
    >
  
      {club.participants?.length > 0 && (
        <ul className="space-y-3">
          {club.participants.map((p, index) => (
            <ul
              key={index}
              className="bg-white rounded-lg p-3 shadow-sm border border-purple-200"
            >
              <li><strong>User:</strong> {p.userEmail}</li>
              <li><strong>Amount:</strong> {p.paymentAmount}</li>
              <li><strong>Status:</strong> {p.paymentStatus}</li>
              <li><strong>Paid At:</strong> {p.payAt}</li>
              <li><strong>Manager:</strong> {p.eventManageEmail}</li>
              <li><strong>TrxID:</strong> {p.trxId}</li>
            </ul>
          ))}
        </ul>
      )}
    </div>
  ))}
</div>

    );
};

export default Participant;