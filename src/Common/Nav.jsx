import React, { useContext, useEffect, useState } from 'react';
import Modal from './Modal';
import { Link } from 'react-router-dom';
import { AuthContext } from '../providers/Authentication';
import axios from 'axios';

const Nav = () => {
    const [Open, setIsOpen] = useState(false);
    const {user,signOutUser}=useContext(AuthContext)
    const [allProfile, setAllProfile]=useState([])
    useEffect(()=>{
        axios.get('http://localhost:5000/users')
        .then(res=>{
                  setAllProfile(res.data)

        })
    })
    const getProfile=email=>{
        const user=allProfile.find(p=>p.email===email)
        console.log(user)
        return user? user : {name:"unknown"} ;
    }
    console.log((user))
    return (
        <div>
            <div className="navbar bg-base-100 shadow-sm">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li><Link to="/">Home</Link></li>
  <li><Link to="/event">Event</Link></li>
  <li><Link to="/champs">Champios</Link></li>
  <li><Link to="/news">News</Link></li>
  <li><Link to="/uni">Universities</Link></li>
                        </ul>
                    </div>
                    <a className="btn btn-ghost text-xl">daisyUI</a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                         <li><Link to="/">Home</Link></li>
  <li><Link to="/event">Event</Link></li>
  <li><Link to="/champs">Champios</Link></li>
  <li><Link to="/news">News</Link></li>
  <li><Link to="/uni">Universities</Link></li>
                        {
                            user && user?.email &&
                            <>
                            <p>{getProfile(user.email).name}</p>
                   
                            <Link to='/dashboard'><li><a>Dashboard</a></li></Link>
                            {/* { 
                                getProfile(user.email).role==='club_admin' && 
                                  <li><Link to="/uni">Pending Events</Link></li>

                            } */}
                            <button onClick={()=>signOutUser()}>Sign Out</button>
                        </>
                        } 
                    </ul>
                </div>
                <div className="navbar-end">
                    <button onClick={() => setIsOpen(true)} className='btn '>button</button>
                </div>
                <Modal open={Open} onclose={() => setIsOpen(false)} />
            </div>
        </div>
    );
};

export default Nav