import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/Authentication';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const DashHome = () => {
  const { user } = useContext(AuthContext)
  const [allProfiles, setAllProfiles] = useState([]);
  const [allClub, setAllClub] = useState([])
  const [allEvent, setAllEvent] = useState([])
  const [allParticipants, setAllParticipants] = useState([])
  const [editEvent, setEditEvent] = useState(false)
  const[invite,setInvite]=useState(false)
  const [createEvent, setCreateEvent]=useState(false)
  const [formData, setFormData] = useState({
    name: event?.name || "",
    date: event?.date || "",
    description: event?.description || "",
    clubId: event?.clubId || "",
    status: event?.status || "Draft",
  });

  useEffect(() => {
    axios.get('http://localhost:5000/users').then(res => { setAllProfiles(res.data) })
    axios.get('http://localhost:5000/club').then(res => { setAllClub(res.data) })
    axios.get('http://localhost:5000/event').then(res => { setAllEvent(res.data) })
    axios.get('http://localhost:5000/participants').then(res => setAllParticipants(res.data))
    
  }, [])
  const getProfiler = (email) => {
    return allProfiles.find(p => p?.email === email) || { name: "Unknown User" };
  }
  const getClub = email => {
    return allClub.find(c => c.clubAdminEmail === user?.email)
  }
  const getEvent = email => {
    return allEvent.find(e => e?.eventManageEmail === user?.email)
  }
  console.log(typeof getClub(user?.email));
  const getClubById = id => {
    return allClub.find(c => c?._id === id)
  }
  const getParticipant = email => {
    return allParticipants?.participants?.filter(p => p?.eventManageEmail === user?.email)
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send updated formData to backend
    console.log("Updated Event:", formData);
  };
  
  const handleInvite = (e) => {
    e.preventDefault();
    const invited={
          name:e.target.name.value, 
          email:e.target.email.value, 
          role:e.target.role.value,
          event:e.target.event_name.value,
          club:e.target.club_name.value,

    }
    axios.put('http://localhost:5000/invite',invited)
    .then(res=>{
      console.log(res.data);
      toast.success('invited successfully',{
        positin:'top-center'
      })
    })
  }
  const handleCreateEvent=e=>{
    e.preventDefault();
    const event={
      name:e.target.name.value,
      eventManageEmail:user?.email,
      universityId:e.target.uniId.value,
      clubId:e.target.clubId.value,
      eventType:e.target.type.value,
      location: e.target.location.value,
      registrationLink: e.target.link.value,
      deadline: e.target.deadline.value,
      eventDate:e.target.eventDate.value,
      prizeMoney:e.target.prizeMoney.value,
      registrationFee:e.target.fee.value,
      registrationProcess:e.target.process.value,
      status:e.target.status.value,
    }
    console.log(event);
    axios.post('http://localhost:5000/event',event) .then(res=> {setAllEvent(res.data);  toast.success('success',{ position:'top-center'}); })
  }
  return (
    <div>

      {
        getProfiler(user?.email)?.role === 'club_admin' && (
          <div>
            {
              <div>
                <div className="mb-6">
                  <h1 className="text-3xl font-bold">Welcome, {getProfiler(user?.email)?.name || getProfiler(user?.email)?.email} 👋</h1>
                  <p className="text-purple-600 mt-2">
                    Managing <strong>{getClub(user?.email)?.name}</strong> at <strong>{getClub(user?.email)?.universityId}</strong>
                  </p>
                  <ToastContainer/>
                </div>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link  className="bg-purple-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-purple-700" onClick={()=>setCreateEvent(!createEvent)}>
                    ➕ Create Event
                  </Link>
                
                  <Link to="/dashboard/manage-events" className="border border-purple-600 text-purple-700 px-6 py-3 rounded-xl hover:bg-purple-50">
                    📋 View All Events
                  </Link>
                  <Link to="/dashboard/participants" className="border border-purple-600 text-purple-700 px-6 py-3 rounded-xl hover:bg-purple-50">
                    👥 Manage Members
                  </Link>
                  <Link to="/dashboard/settings" className="border border-purple-600 text-purple-700 px-6 py-3 rounded-xl hover:bg-purple-50">
                    ⚙️ Settings
                  </Link>
                </div>
              </div>
            }
  {
    createEvent &&  
    <form onSubmit={handleCreateEvent} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create Event</h2>

      <input
        type="text"
        name="name"
        placeholder="Event Name"
       
        required
        className="w-full mb-3 p-2 border rounded"
      />
          <input
        type="text"
        name="uniId"
        placeholder="University Id"
        uniId='uniId'
       value={`${getClub(user?.email)?.universityId}`}
        required
        className="w-full mb-3 p-2 border rounded"
      />
         <input
        type="text"
        name="clubId"
        placeholder="University Id"
        clubId='clubId'
       value={`${getClub(user?.email)?._id}`}
        required
        className="w-full mb-3 p-2 border rounded"
      />
{/* {getClub(user?.email)?.universityId} */}
{/* {getClub(user?.email)?.name} */}
      <input
        type="date"
        name="eventDate"
        eventDate='eventDate'
        required
        className="w-full mb-3 p-2 border rounded"
      />
        <input
        type="text"
        name="fee"
        placeholder='Registration Fee'
        fee='fee'
        required
        className="w-full mb-3 p-2 border rounded"
      />
      <ToastContainer/>
        <input
        type="text"
        name="prizeMoney"
         placeholder='Prize money'
        prizeMoney='prizeMoney'
        required
        className="w-full mb-3 p-2 border rounded"
      />
 <input
        type="text"
        name="link"
         placeholder='Registration Link'
          link='link'
        required
        className="w-full mb-3 p-2 border rounded"
      />
 <input
        type="text"
        name="type"
         placeholder='Event Type'
      typeof='type'
        required
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        type="date"
        name="deadline"
       deadline='deadline'
        required
        placeholder='deadline'
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="text"
        name="location"
        placeholder="Location"
      location='location'
        required
        className="w-full mb-3 p-2 border rounded"
      />
<input
        type="text"
        name="status"
         placeholder='Status'
        value='pending'
        required
        className="w-full mb-3 p-2 border rounded"
      />
      <textarea
        name="process"
        placeholder="Description"
      description='process'
        rows={4}
        className="w-full mb-4 p-2 border rounded"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Create Event
      </button>
    </form>
  }
          </div>
        )
      }
      {
        getProfiler(user?.email)?.role === 'event_manager' && (
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Welcome, {getProfiler(user?.email)?.name || getProfiler(user?.email)?.email} 👋</h1>
              <p className="text-purple-600 mt-2">
                Managing <strong>{getEvent(user?.email)?.name}</strong> at <strong>{getClubById(getEvent(user?.email)?.clubId)?.name}</strong>
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold">📅 Date</h2>
                <p>{getEvent(user?.email)?.date || 'Not set'}</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold">👥 Participants</h2>
                <p>{getParticipant(user?.email)?.length || 0}</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold">📊 Status</h2>
                <p>{getEvent(user?.email)?.status || 'Draft'}</p>
              </div>
            </div>
        

            {/* Quick Actions */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700" onClick={()=>setEditEvent(!editEvent)}>✏️ Edit Event</button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={()=>setInvite(!invite)}>📤 Invite Participants</button>
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">📝 Assign Tasks</button>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">📄 View Reports</button>
              </div>
            </div>

                {
              editEvent && <form onSubmit={handleSubmit} className="space-y-4">
                {/* Event Name */}
                <div>
                  <label className="block font-medium">Event Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full mt-1 border border-gray-300 p-2 rounded"
                    required
                  />
                </div>

                {/* Event Date */}
                <div>
                  <label className="block font-medium">Event Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full mt-1 border border-gray-300 p-2 rounded"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-medium">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full mt-1 border border-gray-300 p-2 rounded"
                    placeholder="Describe the event"
                  ></textarea>
                </div>

                {/* Club Selection */}
                <div>
                  <label className="block font-medium">Select Club</label>
                  <select
                    name="clubId"
                    value={formData.clubId}
                    onChange={handleChange}
                    className="w-full mt-1 border border-gray-300 p-2 rounded"
                    required
                  >
                    <option value="">-- Choose Club --</option>
                    {/* Replace with dynamic club options */}
                    <option value="club1">Photography Club</option>
                    <option value="club2">Tech Club</option>
                    <option value="club3">Drama Club</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block font-medium">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full mt-1 border border-gray-300 p-2 rounded"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div className="text-right">
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            }
            {
              invite && <div>
                   <form onSubmit={handleInvite} className="space-y-4">
                      <div>
          <label className="block font-medium">Event Name</label>
          <input
            type="text"
            name="event_name"
            event_name="event_name"
            value={`${getEvent(user?.email)?.name}`}
            className="w-full mt-1 border border-gray-300 p-2 rounded"
            placeholder="Full name"
            required
          />
        </div>
             <div>
          <label className="block font-medium">Club Name</label>
          <input
            type="text"
            name="club_name"
            club_name="club_name"
            value={`${getClubById(getEvent(user?.email)?.clubId)?.name}`}
            className="w-full mt-1 border border-gray-300 p-2 rounded"
            placeholder="Full name"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
           
         
            className="w-full mt-1 border border-gray-300 p-2 rounded"
            placeholder="Full name"
            required
          />
        </div>
{/* {getEvent(user?.email)?.name} */}
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
           email='email'
            className="w-full mt-1 border border-gray-300 p-2 rounded"
            placeholder="example@email.com"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Role</label>
          <select
            name="role"
          role='role'
            className="w-full mt-1 border border-gray-300 p-2 rounded"
          >
            <option value="Attendee">Attendee</option>
            <option value="Volunteer">Volunteer</option>
            <option value="Performer">Performer</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
        >
          ➕ Invite
        </button>
      </form>
            
  
      {/* <div className="mt-8">
        <h3 className="text-xl font-semibold mb-3">📋 Invited Participants</h3>
        {participants.length === 0 ? (
          <p className="text-gray-500">No participants invited yet.</p>
        ) : (
          <ul className="space-y-3">
            {participants.map((p) => (
              <li key={p.id} className="bg-gray-100 p-3 rounded flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{p.name}</h4>
                  <p className="text-sm text-gray-600">{p.email}</p>
                </div>
                <span className="text-sm bg-purple-200 text-purple-800 px-2 py-1 rounded">
                  {p.role}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div> */}
    
              </div>
            }

            {/* Tasks List */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">To-Do Tasks</h2>
              <ul className="space-y-3">

                {/* <li key={task.id} className="bg-white p-3 rounded shadow flex justify-between items-center"> */}
                <span>{getEvent(user?.email)?.name}</span>
                <span className={`px-2 py-1 text-sm rounded ${getEvent(user?.email)?.status === 'accepted' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                  {getEvent(user?.email)?.status}
                </span>
                {/* </li> */}

              </ul>
            </div>

            {/* // <div className="mb-6">
            //   <h2 className="text-2xl font-bold mb-2">Team Members</h2>
            //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               
            //       <div key={member.id} className="bg-white p-4 rounded shadow">
            //         <h3 className="font-semibold">{member.name}</h3>
            //         <p className="text-sm text-gray-600">{member.role}</p>
            //       </div>
              
            //   </div>
            // </div> */}

            {/* Announcements */}
            {/* <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">📢 Announcements</h2>
              <ul className="space-y-2">
             
                  <li key={announce.id} className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                    <strong>{announce.title}</strong>
                    <p className="text-sm">{announce.message}</p>
                  </li>
               
              </ul>
            </div> */}
          </div>

        )
      }
      {
        getProfiler(user?.email)?.role === 'super_admin' && (
          <div className='flex flex-col w-full'>
            <div className='flex items-center w-full justify-between p-4 bg-blue-600 text-white'>
              <h3 className="w-1/5 text-xl font-semibold">Name</h3>
              <p className="w-1/5 text-xl font-semibold ">Email</p>
              <p className="w-1/5 text-xl font-semibold">Role</p>
              <p className="w-1/5 text-xl font-semibold">Update</p>
              <p className="w-1/5 text-xl font-semibold">Delete</p>
            </div>
            {allProfiles.map(p => (

              <div key={p._id} className="p-4 bg-gray-100 rounded-md flex   items-center gap-4 border-b">


                <div className='flex w-full justify-between p-4 items-center '>
                  <h3 className="w-1/5 text-lg font-semibold">{p.name}</h3>
                  <p className="w-1/5 text-lg font-semibold">{p.email}</p>
                  <p className="w-1/5 text-lg font-semibold">{p.role}</p>
                  <p className='w-1/5'>
                    <button className='btn '>Update</button>
                  </p>
                  <p className='w-1/5'>
                    <button className='btn '>Delete</button>
                  </p>

                </div>
              </div>

            ))}
          </div>
        )
      }
    </div>
  );
};

export default DashHome;