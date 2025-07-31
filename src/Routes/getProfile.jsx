import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../providers/Authentication';

const useProfile = () => {
  const { user } = useContext(AuthContext);
  const [allProfiles, setAllProfiles] = useState([]);
  const [currentUserProfile, setCurrentUserProfile] = useState({ name: 'Unknown', role: 'guest' });

  useEffect(() => {
    axios.get('https://club-event-management-server.vercel.app/users')
      .then(res => {
        setAllProfiles(res.data);
        const found = res.data.find(p => p.email === user?.email);
        setCurrentUserProfile(found || { name: 'Unknown', role: 'guest' });
      })
      .catch(err => console.error('Error fetching users:', err));
  }, [user?.email]);

  return currentUserProfile;
};

export default useProfile;
