import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/Authentication';
import Swal from 'sweetalert2';

const Event = () => {
    const [events, setEvents] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [unis, setUnis] = useState([]);
    const [allProfiles, setAllProfiles] = useState([]);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        axios.get('http://localhost:5000/event').then(res => setEvents(res.data));
        axios.get('http://localhost:5000/club').then(res => setClubs(res.data));
        axios.get('http://localhost:5000/uni').then(res => setUnis(res.data));
        axios.get('http://localhost:5000/users').then(res => setAllProfiles(res.data));
    }, []);

    const getClub = (id) => clubs.find(club => club._id === id) || { name: "Unknown Club" };
    const getUni = (id) => unis.find(uni => uni._id === id) || { name: "Unknown University" };
    const getProfile = (email) => allProfiles.find(p => p.email === email) || { name: "Unknown", role: "guest" };

    const currentUserProfile = getProfile(user?.email);
    const isClubAdmin = currentUserProfile.role === 'club_admin';

    let filteredEvents = []
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



    const handleStatusChange = (eventId, newStatus, currentStatus) => {
        console.log(eventId)
        console.log(getProfile("nsu@admin.com").role)

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
        <div className="grid grid-cols-3 mx-auto mt-10 p-6 gap-6">
            {filteredEvents.length > 0 ? (
                filteredEvents.map((ev, index) => {
                    const club = getClub(ev.clubId);
                    const uni = getUni(club.universityId);

                    return (
                        <div key={ev._id || index} className="col-span-1 p-6 shadow-lg rounded-xl bg-white">
                            <h1 className="text-2xl font-bold mb-4">{ev.name}</h1>
                            <p><strong>Type:</strong> {ev.eventType}</p>
                            <p><strong>Location:</strong> {ev.location}</p>
                            <p><strong>Date:</strong> {new Date(ev.eventDate).toLocaleString()}</p>
                            <p><strong>Deadline:</strong> {ev.deadline}</p>
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
                            <a
                                href={ev.registrationLink}
                                className="inline-block mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Register Now
                            </a>
                        </div>
                    );
                })
            ) : (
                <p className="text-center text-gray-500 col-span-3">No events found.</p>
            )}
        </div>
    );
};

export default Event;
