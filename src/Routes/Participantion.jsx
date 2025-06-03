import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { AuthContext } from '../providers/Authentication';
import axios from 'axios';
const Participantion = ({ userProfile }) => {
    const location = useLocation();
    const { ev } = location.state || {};
    const { user } = useContext(AuthContext)
    console.log(ev, userProfile)

    const [click, setClick] = useState(false);
    const [wished, setWished] = useState(false);
    const handleRegister = () => {
        setClick(!click);
    }
    const handleWish = () => {
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
        axios.post(`http://localhost:5000/wishlist/${user?.email}`, wish)
            .then(res => {
                console.log(res)
                if (res.data.acknowledged) {
                    alert('Added to wishlist')
                    setWished(true);
                }
            })
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
        axios.post('http://localhost:5000/create-ssl-payment', payment)
            .then(res => {

                console.log(res)
                if (res?.data?.paymentUrl) {
                    window.location.replace(res.data.paymentUrl);
                }

            })
    }
    return (
        <div className='flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg shadow-md max-w-2xl mx-auto mt-10'>
            <h1>{ev.name}</h1>
            <p><strong>Type:</strong> {ev.eventType}</p>
            <p><strong>Location:</strong> {ev.location}</p>
            <p><strong>Date:</strong> {new Date(ev.eventDate).toLocaleString()}</p>
            <p><strong>Deadline:</strong> {ev.deadline}</p>
            <p><strong>Managed by:</strong> {ev.eventManageEmail}</p>
            <p><strong>Prize:</strong> ${ev.prizeMoney}k</p>
            <p><strong>Fee:</strong> ${ev.registrationFee}</p>
            <div className='flex items-center gap-4 mt-4'>
                <AddShoppingCartIcon className='rounded-full ' />
                {wished ? <span className='text-green-500'>Added to Wishlist</span> : <FavoriteBorderIcon className='rounded-full text-red-500' onClick={handleWish} disabled={wished} />
                }
                <button className='btn' onClick={handleRegister}>Register Now</button>
            </div>
            {
                click && (
                    <div className='mt-4 p-4 bg-white rounded-lg shadow-md'>
                        <h2 className='text-xl font-semibold mb-2'>Registration Details</h2>
                        <p><strong>Event Name:</strong> {ev.name}</p>
                        <p><strong>Registration Fee:</strong> ${ev.registrationFee}</p>
                        <p><strong>Event Date:</strong> {new Date(ev.eventDate).toLocaleDateString()}</p>
                        <p><strong>Location:</strong> {ev.location}</p>
                        <button className='btn mt-4' onClick={handlePayment}>Confirm Registration</button>
                    </div>
                )
            }
        </div>
    );
};

export default Participantion;