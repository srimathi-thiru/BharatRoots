import React, { useState, useEffect, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../firebaseConfig';
import { AuthContext } from '../../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [isArtisan, setIsArtisan] = useState(false);

  useEffect(() => {
    if (currentUser) {
      checkIfArtisan();
    }
  }, [currentUser]);

  const checkIfArtisan = async () => {
    const q = query(
      collection(db, "artisans"),
      where("userId", "==", currentUser.uid)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      setIsArtisan(true);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#FCFAFA] font-sans">
      {/* Sidebar - fixed left */}
      <Sidebar isArtisan={isArtisan} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Navbar */}
        <TopNav />
        
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#FCFAFA]">
            {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
