import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Check users collection first
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserRole(data.role || "user");
            setUserName(data.name || user.displayName || "User");
          } else {
            // Check artisans collection
            const artisanQuery = query(collection(db, "artisans"), where("userId", "==", user.uid));
            const artisanSnap = await getDocs(artisanQuery);
            if (!artisanSnap.empty) {
              const data = artisanSnap.docs[0].data();
              setUserRole("artisan");
              setUserName(data.name || user.displayName || "Artisan");
            } else {
              setUserRole("user");
              setUserName(user.displayName || "User");
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserRole("user");
          setUserName(user.displayName || "User");
        }
      } else {
        setUserRole(null);
        setUserName(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userRole, userName }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};