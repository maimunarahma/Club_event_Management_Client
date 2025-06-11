import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/Authentication';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
const Event = () => {
    const [events, setEvents] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [unis, setUnis] = useState([]);
    const [allProfiles, setAllProfiles] = useState([]);
    const [dateRange, setDateRange] = useState(false);
    const [query, setQuery] = useState("");
    const { user } = useContext(AuthContext);
    const [type, setType]=useState(false)
    useEffect(() => {
        console.log(query)
        if (query) {
            axios.get(`http://localhost:5000/event?query=${query}`).then(res => setEvents(res.data));
        }
        else {
            axios.get('http://localhost:5000/event').then(res => setEvents(res.data));
        }
        axios.get('http://localhost:5000/club').then(res => setClubs(res.data));
        axios.get('http://localhost:5000/uni').then(res => setUnis(res.data));
        axios.get('http://localhost:5000/users').then(res => setAllProfiles(res.data));
    }, [query]);

    const getClub = (id) => clubs.find(club => club._id === id) || { name: "Unknown Club" };
    const getUni = (id) => unis.find(uni => uni._id === id) || { name: "Unknown University" };
    const getProfile = (email) => allProfiles.find(p => p.email === email) || { name: "Unknown", role: "guest" };

    const currentUserProfile = getProfile(user?.email);
    const isClubAdmin = currentUserProfile.role === 'club_admin';
    let filteredEvents = [];

    if (isClubAdmin) {
        filteredEvents = events.filter(ev => {
            const club = getClub(ev.clubId);
            return club?.clubAdminEmail === user.email;
        })
    }
    else if (getProfile(user?.email).role === 'event_manager') {
        filteredEvents = events.filter(ev => ev.eventManageEmail === user.email);
    }
    else {
        filteredEvents = events;
    }

   const handleType=()=>{
    setType(!type)
    setDateRange('')
   }

    const handleDateRangeChange = () => {
        setDateRange(!dateRange);
        setType('')
    }
    const handleStatusChange = (eventId, newStatus, currentStatus) => {
       
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to accept this event?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, accept it!",
            cancelButtonText: "No, keep pending",
        }).then((result) => {
            if (result.isConfirmed) {
                updateEventStatus(eventId, newStatus);
            }
        });
    }


    const updateEventStatus = (eventId, newStatus) => {
        axios.patch(`http://localhost:5000/event/${eventId}`, { status: newStatus })
            .then(() => {
                setEvents(prev =>
                    prev.map(ev => ev._id === eventId ? { ...ev, status: newStatus } : ev)
                );
                Swal.fire("Success!", "Event status updated.", "success");
            })
            .catch(err => {
                console.error("Failed to update status:", err);
                Swal.fire("Error", "Failed to update status.", "error");
            });
    };


    return (
        <div className="flex flex-col items-center justify-center  bg-purple-200">
            <div className='w-full'>
                <div className='mt-5  grid md:grid-cols-5 grid-cols-2  gap-4 w-[70%] mx-auto'>
                    <button className=" flex items-center gap-2 px-2 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-md transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z" />
                        </svg>
                        Filter Events <ArrowDropDownCircleIcon />
                    </button>
                    <button onClick={handleType} className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-md transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z" />
                        </svg>
                        Event Type<ArrowDropDownCircleIcon />
                    </button>
                    <div className="z-30 relative inline-block text-left">

                        <button onClick={handleDateRangeChange} className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-md transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z" />
                            </svg>
                            Date Range
                            <span className="ml-1">&#9662;</span>
                        </button>

                      {
                        type && 
                          <div className="absolute right-40 mt-2 w-56 rounded-md  bg-white ring-1 ring-black ring-opacity-5 z-50">
                                <div className="py-1 font-semibold  bg-purple-600 text-white  ">

                                
                                    <button className="block w-full px-4 py-2 text-left bg-purple-600 text-white hover:bg-accent hover:text-grey-500" onClick={() => setQuery('all')}>All</button>

                                    <button className="block w-full px-4 py-2 text-left bg-purple-600 text-white hover:bg-accent" onClick={() => setQuery('seminar')}>Seminar</button>

                                    <button className="block w-full px-4 py-2 text-left hover:bg-accent" onClick={() => setQuery('workshop')}>Workshop</button>
                                    <button className="block w-full px-4 py-2 text-left hover:bg-accent" onClick={() => setQuery('competition')}>Competition</button>
                                    <button className="block w-full px-4 py-2 text-left  hover:bg-accent" onClick={() => setQuery('webinar')}>Webinar</button>
                                     <button className="block w-full px-4 py-2 text-left  hover:bg-accent" onClick={() => setQuery('hackathon')}>Hackathon</button>
                                      <button className="block w-full px-4 py-2 text-left  hover:bg-accent">Cultural Program</button>
                                       <button className="block w-full px-4 py-2 text-left  hover:bg-accent" onClick={() => setQuery('sports')}>Sports</button>
                                        <button className="block w-full px-4 py-2 text-left  hover:bg-accent">Social Awareness</button>
                                         <button className="block w-full px-4 py-2 text-left  hover:bg-accent">Tech Talk</button>
                                </div>
                            </div>
                      }

                        {dateRange &&
                            <div className="absolute -right-10 mt-2 w-56 rounded-md  bg-white ring-1 ring-black ring-opacity-5 z-50">
                                <div className="py-1 font-semibold  bg-purple-600 text-white  ">
                                    <button className="block w-full px-4 py-2 text-left bg-purple-600 text-white hover:bg-accent hover:text-grey-500" onClick={() => setQuery('all')}>All</button>

                                    <button className="block w-full px-4 py-2 text-left bg-purple-600 text-white hover:bg-accent" onClick={() => setQuery('today')}>Today</button>

                                    <button className="block w-full px-4 py-2 text-left hover:bg-accent" onClick={() => setQuery('week')}>This Week</button>
                                    <button className="block w-full px-4 py-2 text-left hover:bg-accent" onClick={() => setQuery('month')}>This Month</button>
                                    <button className="block w-full px-4 py-2 text-left  hover:bg-accent">Custom Range</button>
                                </div>
                            </div>}

                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-md transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z" />
                        </svg>
                        Mode<ArrowDropDownCircleIcon />
                    </button>

                </div>
                <div className='grid md:grid-cols-3 grid-cols-1 mx-auto mt-10 p-8 gap-6'>
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((ev, index) => {
                            const club = getClub(ev.clubId);
                            const uni = getUni(club.universityId);

                            return (
                                <div key={ev._id || index} className="col-span-1 space-y-4 p-6 shadow-lg rounded-xl bg-white">
                                    <h1 className="text-2xl font-bold mb-4">{ev.name}</h1>
                                    <p className='flex justify-start items-center gap-4'><img src="/genres.png" alt="" className='w-15 h-10' title="Event Type" /> <strong>{ev.eventType}</strong></p>
                                    <p className='flex justify-start items-center gap-4'><img src="/map.png" alt="" className='w-15 h-10' title='location' /><strong> {ev.location}</strong></p>
                                    <p className='flex justify-start items-center gap-4'><img src="/calendar.png" alt="" className='w-15 h-10' title='event date' /><strong> {new Date(ev.eventDate).toLocaleString()}</strong></p>
                                    <p className='flex justify-start items-center gap-4'><img src="deadline.png" alt="" className='w-15 h-10' title='registration deadline' /><strong>{ev.deadline}</strong> </p>
                                    <p><strong>Managed by:</strong> {ev.eventManageEmail}</p>
                                    <p><strong>Prize:</strong> ${ev.prizeMoney}k</p>
                                    <p><strong>Fee:</strong> ${ev.registrationFee}</p>
                                    {
                                        getProfile(user?.email).role === 'club_admin' ?
                                            (

                                                <div className="mt-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Change Status:</label>
                                                    <h1>{getProfile(getClub(ev.clubId).clubAdminEmail).role}</h1>
                                                    <select
                                                        value={ev.status}
                                                        onChange={e => handleStatusChange(ev._id, e.target.value, ev.status)}
                                                        className="p-2 border rounded"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="accepted">Accepted</option>
                                                    </select>
                                                </div>) :
                                            <h1>{ev.status}</h1>
                                    }

                                    <p><strong>Club:</strong> {club.name}</p>
                                    <p><strong>Club Admin:</strong> {club.clubAdminEmail}</p>
                                    <p><strong>University:</strong> {uni.name}</p>
                                    <Link to={`/event/${ev._id}`} state={{ ev }} userProfile={currentUserProfile}>
                                        <button event={ev} className='btn'
                                        >
                                            Register Now
                                        </button>
                                    </Link>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-500 col-span-3">No events found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Event;
