import HeroSection from "../components/home/HeroSection";
import WhyBharatRoots from "../components/home/WhyBharatRoots";
import FeaturedCrafts from "../components/home/FeaturedCrafts";
import ArtisanPreview from "../components/home/ArtisanPreview";
import VerificationCTA from "../components/home/VerificationCTA";
import Footer from "../components/footer";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

const LandingPage = () => {
  return (
    <PageWrapper>
      {/* NAVBAR */}
      <nav className="w-full bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

          <div className="flex items-center gap-3">
            <img
              src="/bharatroots-logo.png"
              alt="BharatRoots Logo"
              className="h-10 w-10"
            />
            <h1 className="text-2xl font-bold text-indigo-700">
              BharatRoots
            </h1>
          </div>

          <div className="flex gap-4">
            <Link
              to="/login/user"
              className="px-5 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
            >
              User Login
            </Link>

            <Link
              to="/login/artisan"
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Artisan Login
            </Link>
          </div>

        </div>
      </nav>

      <HeroSection />
      <WhyBharatRoots />
      <FeaturedCrafts />
      <ArtisanPreview />
      <VerificationCTA />
      <Footer />
    </PageWrapper>
  );
};

export default LandingPage;