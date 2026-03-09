import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden">

      {/* FULL WIDTH BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-blue-600 to-orange-400"></div>
      <div className="absolute inset-0 bg-black/10"></div>

      {/* ALIGNED CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">

        <div className="max-w-2xl">

          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-white">
            Digital Platform for
            <span className="block text-yellow-300">
              Swadeshi Heritage
            </span>
          </h1>

          <p className="text-lg md:text-xl opacity-90 mb-10 text-white">
            Preserve India’s living heritage, empower artisans,
            and verify authentic Swadeshi products.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/heritage" className="bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg">
              Explore Heritage
            </Link>

            <Link to="/verify" className="border-2 border-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition shadow-lg text-white">
              Verify Product
            </Link>

            <Link to="/register-artisan" className="bg-green-600 px-8 py-3 rounded-full hover:scale-105 transition-transform shadow-lg text-white">
              Join as Artisan
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;