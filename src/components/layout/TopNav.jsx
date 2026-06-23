import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { Link } from 'react-router-dom';
import { MdSearch, MdNotificationsNone, MdLogout } from 'react-icons/md';
import CartButton from '../CartButton';

const TopNav = ({ onMenuClick }) => {
  const { userName, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    if (logout) {
      await logout();
    } else {
      await signOut(auth);
      window.location.href = '/';
    }
  };

  return (
    <nav className="bg-white border-b border-zinc-200 px-4 lg:px-6 sticky top-0 z-10 w-full h-[60px] flex items-center justify-between">

      {/* LEFT — Hamburger + Logo */}
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 transition-colors"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="2" y1="5" x2="18" y2="5" />
            <line x1="2" y1="10" x2="18" y2="10" />
            <line x1="2" y1="15" x2="18" y2="15" />
          </svg>
        </button>

        {/* Logo — mobile only */}
        <Link to="/dashboard" className="lg:hidden flex items-center gap-2">
          <div className="p-1 bg-zinc-900 rounded-md">
            <img src="/bharatroots-logo.svg" alt="Logo" className="h-5 w-5 filter brightness-0 invert" onError={e => e.target.style.display = 'none'} />
          </div>
          <span className="text-base font-black tracking-tight text-zinc-900 font-display">
            Bharat<span className="text-amber-600 font-normal">Roots</span>
          </span>
        </Link>

        {/* Greeting — desktop only */}
        <div className="hidden lg:flex flex-col">
          <h2 className="text-base font-display text-zinc-800 flex items-center gap-1">
            <span className="font-light text-zinc-400">Good Morning,</span>
            <span className="font-bold">{userName || 'User'}</span>
          </h2>
          <p className="text-[11px] text-zinc-400 uppercase tracking-wider">Welcome back to your dashboard</p>
        </div>
      </div>

      {/* RIGHT — Actions */}
      <div className="flex items-center gap-1 sm:gap-2">

        {/* Search — icon only on mobile, full bar on desktop */}
        <Link
          to="/search"
          className="lg:hidden p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-indigo-600 transition-colors"
        >
          <MdSearch size={22} />
        </Link>
        <Link
          to="/search"
          className="hidden lg:flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm text-zinc-400 hover:border-indigo-300 hover:text-indigo-500 transition-all"
        >
          <MdSearch size={16} />
          Search artifacts...
        </Link>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-amber-600 transition-colors">
          <MdNotificationsNone size={22} />
          <span className="absolute top-1.5 right-1.5 bg-red-500 w-2 h-2 rounded-full border-2 border-white"></span>
        </button>

        {/* Cart */}
        <div className="p-1">
          <CartButton />
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-zinc-200 mx-1 hidden sm:block" />

        {/* Profile avatar */}
        <Link
          to="/profile"
          className="h-8 w-8 rounded-full bg-zinc-900 text-amber-400 hover:bg-zinc-700 flex items-center justify-center font-bold text-sm shadow transition-colors"
          title="My Profile"
        >
          {(userName || 'U')[0].toUpperCase()}
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          title="Logout"
        >
          <MdLogout size={20} />
        </button>

      </div>
    </nav>
  );
};

export default TopNav;
