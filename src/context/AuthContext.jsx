import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 LOGOUT FUNCTION (ADDED)
  const logout = async () => {
    try {
      await signOut(auth);

      // ✅ Redirect to Landing Page
      window.location.href = "/"; 
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Check users collection
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            const fetchedRole = data.role || "user";
            setUserRole(fetchedRole);
            
            if (fetchedRole === "artisan") {
              const artisanQuery = query(
                collection(db, "artisans"),
                where("userId", "==", user.uid)
              );
              const artisanSnap = await getDocs(artisanQuery);
              if (!artisanSnap.empty) {
                setUserName(artisanSnap.docs[0].data().name || "Artisan");
              } else {
                setUserName("Artisan");
              }
            } else if (fetchedRole === "admin") {
              setUserName(data.name || "Admin");
            } else {
              const fallbackName = data.name || user.displayName || user.email?.split('@')[0] || "User";
              setUserName(fallbackName);
            }
          } else {
            // Check artisans collection directly just in case
            const artisanQuery = query(
              collection(db, "artisans"),
              where("userId", "==", user.uid)
            );

            const artisanSnap = await getDocs(artisanQuery);

            if (!artisanSnap.empty) {
              const data = artisanSnap.docs[0].data();
              setUserRole("artisan");
              setUserName(data.name || user.displayName || "Artisan");
            } else {
              setUserRole("user");
              const fallbackName = user.displayName || user.email?.split('@')[0] || "User";
              setUserName(fallbackName);
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
    <AuthContext.Provider 
      value={{ currentUser, userRole, userName, logout }}  // ✅ added logout
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};