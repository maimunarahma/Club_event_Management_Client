import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../providers/Authentication';
// import { filteredEvents } from '../Routes/Event';

const Participant = () => {
    // console.log(filteredEvents);
    const [participants, setParticipants] = React.useState([]);
    const [events, setEvents] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [unis, setUnis] = useState([]);
    const [allProfiles, setAllProfiles] = useState([]);
    const { user } = useContext(AuthContext);
    let filteredEvents = [];

    useEffect(() => {

        axios.get('https://club-event-management-server.vercel.app/event').then(res => setEvents(res.data));

        axios.get('https://club-event-management-server.vercel.app/club').then(res => setClubs(res.data));
        axios.get('https://club-event-management-server.vercel.app/uni').then(res => setUnis(res.data));
        axios.get('https://club-event-management-server.vercel.app/users').then(res => setAllProfiles(res.data));
         axios.get('https://club-event-management-server.vercel.app/participants')
            .then(res => {
                if (res.data) {
                    setParticipants(res.data);
                }
            })
           
    }, []);
      const getClub = (id) => clubs.find(club => club._id === id) || { name: "Unknown Club" };
    // const getUni = (id) => unis.find(uni => uni._id === id) || { name: "Unknown University" };
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
 
 const allClubs = filteredEvents.map(event => ({
  eventId: event._id,
  clubId: event.clubId,
  participants: participants?.participants?.filter(p => p.eventId === event._id)
}));

    console.log(typeof allClubs, allClubs, Array.isArray(allClubs));
    return (
    <div className="flex flex-wrap gap-4 p-4 bg-white text-purple-900 w-full">
  {allClubs.map((club) => (
    <div
      key={club.eventId}
      className="bg-purple-100 rounded-xl shadow-md p-4 w-full md:w-1/2 lg:w-1/3"
    >
      <h3 className="text-lg font-semibold mb-2 text-purple-700">
        {getClub(club.clubId)?.name}
      </h3>

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