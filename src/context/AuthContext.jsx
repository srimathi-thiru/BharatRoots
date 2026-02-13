import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      if (user) {

        setCurrentUser(user);

        // fetch role from Firestore
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserRole(docSnap.data().role);
        }

      } else {

        setCurrentUser(null);
        setUserRole(null);

      }

    });

    return () => unsubscribe();

  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};
