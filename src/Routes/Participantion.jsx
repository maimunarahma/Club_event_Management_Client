import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteSharpIcon from '@mui/icons-material/FavoriteSharp';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { AuthContext } from '../providers/Authentication';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
const Participantion = () => {
    const location = useLocation();
    const { ev, userProfile } = location.state || {};
    const { user } = useContext(AuthContext)
    console.log(user)
    console.log(ev, userProfile)

    const [click, setClick] = useState(false);
    const [wished, setWished] = useState(false);
    const handleRegister = () => {
        setClick(!click);
    }
    const handleWish = async(wished) => {
        const wish = {
            eventId: ev._id,
            userEmail: user.email,
            userName: userProfile?.name,
            eventName: ev.name,
            eventType: ev.eventType,
            location: ev.location,
            eventDate: ev.eventDate,
            registrationFee: ev.registrationFee
        }
        if (wished === false) {
            axios.post(`https://club-event-management-server.onrender.com/wishlist/${user?.email}`, wish)
                .then(res => {
                    console.log(res)
                    if (res.data.acknowledged) {
                        // alert('Added to wishlist')
                        toast.success("Event added to wishlist", {
                            position: "top-center"
                        })
                        setWished(true);
                    }
                })
        }
        else if (wished === true) {
           
          try {
    const res = await axios.get('https://club-event-management-server.onrender.com/wishlist');
    const allWishes = res.data;

    const wish = allWishes.find(w => w.userEmail === user?.email && w.eventId === ev._id);
    const wishId = wish?._id;

    if (!wishId) {
      toast.error("No matching wishlist found");
      return;
    }

    const deleteRes = await axios.delete(`https://club-event-management-server.onrender.com/wishlist/${wishId}`);
    
    if (deleteRes.data.deletedCount > 0) {
      toast.error("Event removed from wishlist", {
        position: "top-center"
      });
      setWished(false);
    } else {
      toast.error("Failed to remove event from wishlist");
    }

  } catch (error) {
    console.error("Error removing wishlist:", error);
    toast.error("Something went wrong");
  }
        }
    }
    const handlePayment = () => {
        const payment = {
            eventId: ev._id,
            userEmail: user.email,
            userName: userProfile?.name,
            paymentAmount: ev.registrationFee,
            payAt: new Date().toISOString(),
            paymentStatus: 'pending'

        }
        console.log(payment)
        axios.post('https://club-event-management-server.onrender.com/create-ssl-payment', payment)
            .then(res => {

                console.log(res)
                if (res?.data?.paymentUrl) {
                    window.location.replace(res.data.paymentUrl);
                }

            })
    }
    return (
        <div className="bg-white max-w-3xl mx-auto mt-12 p-8 rounded-2xl shadow-xl border border-purple-100">
            <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">{ev.name}</h1>
            <ToastContainer />
            <div className="space-y-3 text-gray-700 text-base leading-relaxed">
                <p><span className="font-medium text-purple-600">Type:</span> {ev.eventType}</p>
                <p><span className="font-medium text-purple-600">Location:</span> {ev.location}</p>
                <p><span className="font-medium text-purple-600">Date:</span> {new Date(ev.eventDate).toLocaleString()}</p>
                <p><span className="font-medium text-purple-600">Deadline:</span> {ev.deadline}</p>
                <p><span className="font-medium text-purple-600">Managed by:</span> {ev.eventManageEmail}</p>
                <p><span className="font-medium text-purple-600">Prize:</span> <span className="text-purple-800 font-semibold">${ev.prizeMoney}k</span></p>
                <p><span className="font-medium text-purple-600">Fee:</span> <span className="text-purple-800 font-semibold">${ev.registrationFee}</span></p>
            </div>

            {
                userProfile.role === "general_user" && <div className="flex items-center gap-4 mt-6">
                    <AddShoppingCartIcon className="text-purple-600" />
                    {wished ? (
                        <FavoriteSharpIcon onClick={() => handleWish(wished)} />
                    ) : (
                        <FavoriteBorderIcon
                            className="text-purple-500 cursor-pointer hover:text-purple-700 transition"
                            onClick={() => handleWish(wished)}

                        />
                    )}

                    <button
                        className="ml-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg shadow-sm transition"
                        onClick={handleRegister}
                    >
                        Register Now
                    </button>
                </div>
            }


            {click && (
                <div className="mt-8 p-6 bg-purple-50 rounded-xl border border-purple-200 shadow-inner">
                    <h2 className="text-xl font-bold text-purple-700 mb-4">Registration Details</h2>
                    <ul className="space-y-2 text-gray-700">
                        <li><span className="font-medium text-purple-600">Event Name:</span> {ev.name}</li>
                        <li><span className="font-medium text-purple-600">Registration Fee:</span> ${ev.registrationFee}</li>
                        <li><span className="font-medium text-purple-600">Event Date:</span> {new Date(ev.eventDate).toLocaleDateString()}</li>
                        <li><span className="font-medium text-purple-600">Location:</span> {ev.location}</li>
                    </ul>
                    <button
                        className="mt-6 bg-purple-700 hover:bg-purple-800 text-white px-5 py-2 rounded-md font-medium shadow transition"
                        onClick={handlePayment}
                    >
                        Confirm Registration
                    </button>
                </div>
            )}
        </div>

    );
};

export default Participantion;