import { Link } from "react-router-dom";

const LandingNavbar = () => {
  return (
    <nav className="flex justify-between items-center px-10 py-4 bg-white shadow-sm">
      
      {/* LEFT: Logo + Title */}
      <div className="flex items-center gap-3">
        <img
          src="/bharatroots-logo.png"   // place logo in public folder
          alt="BharatRoots Logo"
          className="h-10 w-10"
        />
        <h1 className="text-2xl font-bold text-indigo-700">
          BharatRoots
        </h1>
      </div>

      {/* RIGHT: Login Access */}
      <div className="flex gap-4">
        <Link
          to="/login/user"
          className="px-5 py-2 border border-indigo-600 text-indigo-600
          rounded-lg hover:bg-indigo-50 transition"
        >
          User Login
        </Link>

        <Link
          to="/login/artisan"
          className="px-5 py-2 bg-green-600 text-white
          rounded-lg hover:bg-green-700 transition"
        >
          Artisan Login
        </Link>
      </div>
    </nav>
  );
};

export default LandingNavbar;