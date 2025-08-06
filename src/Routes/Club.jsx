import React, { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FaStar, FaRegStar, FaUserPlus } from 'react-icons/fa';
import { RiVipCrownFill } from 'react-icons/ri';
import { AuthContext } from '../providers/Authentication';
import { toast, ToastContainer } from 'react-toastify';

const Club = () => {
  const { data: clubs = [], isLoading, isError } = useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const res = await axios.get('https://club-event-management-server.onrender.com/club');
      return res.data;
    },
  });

  const [favorites, setFavorites] = useState({});
  const [members, setMembers] = useState({});
  const [following, setFollowing] = useState({});
  const { user } = useContext(AuthContext)
  const toggleFavorite = (id) => {

    const isNowFav = !favorites[id]
    setFavorites(prev => ({ ...prev, [id]: isNowFav }))
    console.log('favorites:', favorites);
    if (isNowFav) {
      try {
        axios.post(`http://localhost:5000/favourites/${user?.email}`, { email: user?.email, clubId: id, isFav: true })
          .then(res => {
            // setFavorites(res.data)
            console.log((res.data))
            if (res.data.insertedId) {
              toast.success("Add to favourote List", {
                position: "top-center"
              })
            }
            else if (res.data.message === 'already exist') {
              toast.info("Already in Favorites", { position: "top-center" });
            }
          })

      }
      catch {
        console.error("Favorite error:", err);
        toast.error("Failed to add to favorites");
      }
    }


  
}
const toggleMember = (id) => {
  setMembers((prev) => ({ ...prev, [id]: !prev[id] }));
};

const toggleFollow = (id) => {
  console.log(id)
   const isNowFollow = !following[id];
  setFollowing(prev => ({ ...prev, [id]: isNowFollow }));

    if (isNowFollow) {

    try{  axios.post(`http://localhost:5000/favourites/${user?.email}`, { email: user?.email, clubId: id, isFav: false })
        .then(res => {
          // setFavorites(res.data)
          console.log((res.data))
          if (res.data.insertedId) (
            toast.success("Add to Following List", {
              position: "top-center"
            })
          )

        })}
        catch (err) {
      console.error("Follow error:", err);
      toast.error("Failed to follow");
    }
    }  
   
  
};
  // const admin=use
if (isLoading) return <p className="text-center mt-10">Loading clubs...</p>;
if (isError) return <p className="text-center mt-10 text-red-500">Error fetching clubs.</p>;

return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
   
    {clubs.map((club) => (
      <div
        key={club._id}
        className="p-6 rounded-xl shadow-lg bg-white space-y-4 border hover:shadow-xl transition-all duration-300"
      > <ToastContainer />
        <h2 className="text-2xl font-bold text-primary">{club.name}</h2>

        <div className="flex items-center gap-3">
          <img src="/badge.png" alt="Type" className="w-6 h-6" />
          <span className="font-medium capitalize">{club.type}</span>
        </div>

        <div className="flex items-center gap-3">
          <img src="/university.png" alt="University" className="w-6 h-6" />
          <span className="font-medium">{club.universityId}</span>
        </div>

        <div className="flex items-center gap-3">
          <img src="/admin.png" alt="Club Admin" className="w-6 h-6" />
          <span className="font-medium">Contact with Admin: {club.clubAdminId}</span>
        </div>

        <div className="flex justify-between items-center pt-4 border-t mt-4">
          {/* Favorite */}
          <button
            onClick={() => toggleFavorite(club._id)}
            className={`text-xl transition hover:text-yellow-500 ${favorites?.[club._id] ? 'text-yellow-500' : 'text-gray-500'
              }`}
            title="Add to Favorite"
          >
            {favorites?.[club._id] ? <FaStar /> : <FaRegStar />}
          </button>

          {/* Become Member */}
          <button
            onClick={() => toggleMember(club._id)}
            className={`text-xl transition hover:text-green-600 ${members[club._id] ? 'text-green-600' : 'text-gray-500'
              }`}
            title="Become a Member"
          >
            <FaUserPlus />
          </button>

          {/* Follow (Premium) */}
          <button
            onClick={() => toggleFollow(club._id)}
            className={`text-xl transition hover:text-purple-600 ${following[club._id] ? 'text-purple-600' : 'text-gray-500'
              }`}
            title="Follow (Premium)"
          >
            <RiVipCrownFill />
          </button>
        </div>
      </div>
    ))}
  </div>
);
};

export default Club;
