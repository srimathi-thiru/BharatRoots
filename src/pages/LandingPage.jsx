import HeroSection from "../components/home/HeroSection";
import DynamicFeaturedProducts from "../components/home/DynamicFeaturedProducts";
import DynamicExploreHeritage from "../components/home/DynamicExploreHeritage";
import VerificationCTA from "../components/home/VerificationCTA";
import Footer from "../components/footer";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

const LandingPage = () => {
  return (
    <PageWrapper>
      {/* PREMIUM FLOATING NAVBAR */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl glass rounded-2xl px-4 md:px-6 py-3 md:py-4 flex justify-between items-center bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl transition-all duration-300">
        
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
            <img
              src="/bharatroots-logo.svg"
              alt="BharatRoots Logo"
              className="h-5 w-5 md:h-7 md:w-7 filter brightness-0 invert"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <h1 className="text-lg md:text-2xl font-black tracking-tight text-slate-900 font-display">
            Bharat<span className="text-indigo-600 font-normal">Roots</span>
          </h1>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <Link to="/heritage" className="hover:text-indigo-600 transition-colors">Heritage</Link>
          <Link to="/products" className="hover:text-indigo-600 transition-colors">Marketplace</Link>
          <Link to="/verify" className="hover:text-indigo-600 transition-colors">Verification</Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/login/user"
            className="hidden sm:block px-4 py-2 text-sm font-bold text-slate-700 hover:text-indigo-600 transition"
          >
            Login
          </Link>
          <Link
            to="/login/artisan"
            className="px-4 md:px-6 py-2 md:py-2.5 bg-slate-900 text-white text-xs md:text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all duration-300"
          >
            Join as Artisan
          </Link>
        </div>
      </nav>

      <HeroSection />
      <DynamicFeaturedProducts />
      <DynamicExploreHeritage />
      <VerificationCTA />
      <Footer />
    </PageWrapper>
  );
};

export default LandingPage;