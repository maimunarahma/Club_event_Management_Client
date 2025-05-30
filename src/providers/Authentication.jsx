import { createContext, useEffect, useState } from "react";

import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";

import axios from "axios";
import { auth } from "./Firebase.init";

export const AuthContext = createContext(null);

const Authentication = ({ children }) => {

  const SignUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
  }
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

     useEffect(() => {
        const unsubcribe = onAuthStateChanged(auth, currentUser => {
            console.log('Current State : ', currentUser?.email)

            if (currentUser?.email) {
                setUser(currentUser);
                setLoading(false);
            }
            else {
                setUser(null);
                setLoading(false);

            }
        })

        return () => {
            unsubcribe()
        }
    }, [])

  const updateProfileUser = (updateInfo) => {
    return updateProfile(auth.currentUser, updateInfo);


  }

  const signOutUser = () => {
    axios.post('https://micro-earning-server.vercel.app/logout')
      .then(res => {
        console.log("logout", res.data)
      })

    signOut(auth)
  }
  const AuthValue = {
    SignUp,
    login,
    setUser,
    user,
    signOutUser,
    updateProfileUser,
    loading,
    setLoading

  }
  return (
    <AuthContext.Provider value={AuthValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default Authentication;