import React, { useContext } from 'react';
import { AuthContext } from '../providers/Authentication';

const Private = ({children}) => {
    const {user}=useContext(AuthContext)
    console.log(user?.email)
    if(user && user?.email){
        return children;
    }
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
                <p className="text-lg">You must be logged in to view this page.</p>
            </div>
        </div>
    );
};

export default Private;