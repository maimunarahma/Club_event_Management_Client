import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/Authentication';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import { useQuery } from '@tanstack/react-query';
import {
    MdCategory,
    MdLocationOn,
    MdCalendarToday,
    MdOutlineAccessTime,
    MdEmojiEvents,
    MdAttachMoney,
    MdEmail
} from 'react-icons/md';



const Event = () => {
    const [dateRange, setDateRange] = useState(false);
    const [query, setQuery] = useState('');
    const { data: events = [], isLoading: loadingEvents } = useQuery({
        queryKey: ['events', query],
        queryFn: () => fetchEvents(query),
    });
    const { data: clubs = [] } = useQuery({
        queryKey: ['clubs', query],
        queryFn: () => fetchClubs(query)
    });
    const { data: unis = [] } = useQuery({
        queryKey: ['unis', query],
        queryFn: () => fetchUnis(query)
    });
    const { data: allProfiles = [] } = useQuery({
        queryKey: ['users', query],
        queryFn: () => fetchUsers(query)
    });

    const { user } = useContext(AuthContext);
    const [type, setType] = useState(false)
    const fetchEvents = async (query) => {
        const res = await axios.get(`https://club-event-management-server.onrender.com/event${query ? `?query=${query}` : ''}`);
        return res.data;
    };

    const fetchClubs = async () => {
        const res = await axios.get('https://club-event-management-server.onrender.com/club');
        return res.data;
    };

    const fetchUnis = async () => {
        const res = await axios.get('https://club-event-management-server.onrender.com/uni');
        return res.data;
    };

    const fetchUsers = async () => {
        const res = await axios.get('https://club-event-management-server.onrender.com/users');
        return res.data;
    };

    const getClub = (id) => clubs.find(club => club._id === id) || { name: "Unknown Club" };
    const getUni = (id) => unis.find(uni => uni._id === id) || { name: "Unknown University" };
    const getProfile = (email) => allProfiles.find(p => p.email === email) || { name: "Unknown", role: "guest" };

    const currentUserProfile = getProfile(user?.email);
    console.log(currentUserProfile)
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

    const handleType = () => {
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
        axios.patch(`https://club-event-management-server.onrender.com/event/${eventId}`, { status: newStatus })
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
                                <div key={ev._id || index} className="col-span-1 space-y-4 p-6 shadow-lg rounded-xl bg-white border border-gray-200">
                                    <h1 className="text-2xl font-bold text-purple-700 mb-4">{ev.name}</h1>

                                    <p className='flex items-center gap-2 text-gray-700'>
                                        <MdCategory className="text-xl text-blue-500" title="Event Type" />
                                        <strong>{ev.eventType}</strong>
                                    </p>

                                    <p className='flex items-center gap-2 text-gray-700'>
                                        <MdLocationOn className="text-xl text-red-500" title="Location" />
                                        <strong>{ev.location}</strong>
                                    </p>

                                    <p className='flex items-center gap-2 text-gray-700'>
                                        <MdCalendarToday className="text-xl text-green-600" title="Event Date" />
                                        <strong>{new Date(ev.eventDate).toLocaleString()}</strong>
                                    </p>

                                    <p className='flex items-center gap-2 text-gray-700'>
                                        <MdOutlineAccessTime className="text-xl text-yellow-600" title="Registration Deadline" />
                                        <strong>{ev.deadline}</strong>
                                    </p>

                                    <p className='flex items-center gap-2 text-gray-700'>
                                        <MdEmail className="text-xl text-purple-600" title="Manager" />
                                        <strong>Managed by:</strong> {ev.eventManageEmail}
                                    </p>

                                    <p className='flex items-center gap-2 text-gray-700'>
                                        <MdEmojiEvents className="text-xl text-orange-500" title="Prize" />
                                        <strong>Prize:</strong> ${ev.prizeMoney}k
                                    </p>

                                    <p className='flex items-center gap-2 text-gray-700'>
                                        <MdAttachMoney className="text-xl text-green-700" title="Fee" />
                                        <strong>Fee:</strong> ${ev.registrationFee}
                                    </p>

                                    {
                                        getProfile(user?.email).role === 'club_admin' ? (
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Change Status:</label>
                                                <h1>{getProfile(getClub(ev.clubId).clubAdminEmail).role}</h1>
                                                <select
                                                    value={ev.status}
                                                    onChange={e => handleStatusChange(ev._id, e.target.value, ev.status)}
                                                    className="p-2 border rounded bg-gray-50"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="accepted">Accepted</option>
                                                </select>
                                            </div>
                                        ) : (
                                            <h1><strong>Status:</strong> {ev.status}</h1>
                                        )
                                    }

                                    <p><strong>Club:</strong> {club.name}</p>
                                    <p><strong>Club Admin:</strong> {club.clubAdminEmail}</p>
                                    <p><strong>University:</strong> {uni.name}</p>

                                    <Link to={`/event/${ev._id}`} state={{ ev, userProfile: currentUserProfile }}>
                                        <button event={ev} className='w-full py-2 mt-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition'>
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
