import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // important

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      if (user) {

        setCurrentUser(user);

        try {

          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserRole(docSnap.data().role);
          } else {
            setUserRole("USER"); // fallback role
          }

        } catch (error) {
          console.error("Error fetching role:", error);
          setUserRole("USER");
        }

      } else {

        setCurrentUser(null);
        setUserRole(null);

      }

      setLoading(false);

    });

    return () => unsubscribe();

  }, []);

  return (
    <AuthContext.Provider value={{
      currentUser,
      userRole,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );

};
