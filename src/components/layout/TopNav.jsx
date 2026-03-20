import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useNavigate, Link } from 'react-router-dom';
import { MdSearch, MdMailOutline, MdNotificationsNone, MdLogout } from 'react-icons/md';
import CartButton from '../CartButton';

const TopNav = () => {
  const { currentUser, userName } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/", { replace: true });
  };

  const today = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }).format(new Date());

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 w-full h-[70px]">
      {/* Left part */}
      <div className="flex flex-col">
        <h2 className="text-xl font-display text-zinc-800 hidden md:flex items-center gap-2">
           <span className="font-light text-zinc-500">Good Morning, </span> 
           <span className="font-bold">{userName || "User"}</span>
        </h2>
        <p className="text-xs text-zinc-400 font-medium hidden lg:block uppercase tracking-wider mt-0.5">Welcome back to your dashboard</p>
        
        {/* Mobile menu toggle placeholder */}
        <div className="md:hidden flex items-center gap-2">
            <img src="/bharatroots-logo.svg" alt="BharatRoots Logo" className="h-6 w-6" onError={(e) => { e.target.style.display = 'none'; }} />
            <h1 className="text-xl font-bold font-display text-zinc-900">BharatRoots</h1>
        </div>
      </div>

      {/* Right part */}
      <div className="flex items-center space-x-4 md:space-x-6">
        
        {/* Search Input Link */}
        <Link to="/search" className="hidden lg:flex items-center space-x-4 group cursor-pointer">
            <div className="relative pointer-events-none">
                <select className="appearance-none bg-[#FCFAFA] border border-zinc-200 text-zinc-600 text-sm rounded-lg group-hover:border-indigo-300 block w-full px-4 py-2 outline-none min-w-[140px] transition-all">
                   <option>Global Search</option>
                </select>
            </div>
            
            <div className="flex items-center border border-zinc-200 bg-[#FCFAFA] rounded-lg px-4 py-2 shadow-sm group-hover:border-indigo-300 transition-all">
                <MdSearch className="text-zinc-400 mr-2 group-hover:text-indigo-500 transition-colors" size={18} />
                <span className="text-sm border-l border-zinc-200 pl-2 text-zinc-400 font-medium">Search artifacts...</span>
            </div>
        </Link>

        {/* Mobile Search Link */}
        <Link to="/search" className="text-zinc-500 hover:text-indigo-600 lg:hidden transition-colors">
            <MdSearch size={22} />
        </Link>
        <button className="text-zinc-500 hover:text-amber-600 relative transition-colors">
            <MdMailOutline size={22} />
        </button>
        <button className="text-zinc-500 hover:text-amber-600 relative transition-colors">
            <MdNotificationsNone size={22} />
            <span className="absolute top-0 right-0 bg-red-500 w-2 h-2 border-2 border-white rounded-full"></span>
        </button>
        
        <div className="bg-[#FCFAFA] border border-zinc-100 rounded-full px-2 py-1 flex items-center">
            <CartButton />
        </div>

        <div className="flex items-center gap-3 pl-3 border-l border-zinc-200">
            <Link to="/profile" className="h-9 w-9 rounded-full bg-zinc-900 text-amber-400 hover:bg-zinc-800 flex items-center justify-center font-bold shadow-md transition-colors cursor-pointer" title="My Profile">
                {(userName || "U")[0].toUpperCase()}
            </Link>
            <button onClick={handleLogout} className="text-zinc-400 hover:text-red-500 transition-colors" title="Logout">
                <MdLogout size={22} />
            </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
