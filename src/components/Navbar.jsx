import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LandingNavbar = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
      
      {/* LEFT: Logo + Title */}
      <div className="flex items-center gap-3 h-10">
        <img
          src="/bharatroots-logo.svg"
          alt="BharatRoots Logo"
          className="h-10 w-10"
        />
        <h1 className="text-2xl font-bold text-indigo-700">
          {t("BharatRoots")}
        </h1>
      </div>

      {/* RIGHT: Login Access & Language */}
      <div className="flex items-center gap-4 h-10">
        
        <select 
          onChange={(e) => changeLanguage(e.target.value)}
          defaultValue={i18n.language}
          className="p-2 border rounded-md text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी (Hindi)</option>
          <option value="ta">தமிழ் (Tamil)</option>
        </select>

        <Link
          to="/login/user"
          className="px-5 py-2 border border-indigo-600 text-indigo-600
          rounded-lg hover:bg-indigo-50 transition"
        >
           {t("User Login")}
        </Link>

        <Link
          to="/login/artisan"
          className="px-5 py-2 bg-green-600 text-white
          rounded-lg hover:bg-green-700 transition"
        >
          {t("Artisan Login")}
        </Link>
      </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;