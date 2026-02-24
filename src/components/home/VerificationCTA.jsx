import { Link } from "react-router-dom";

const VerificationCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-green-700 to-emerald-500 text-white text-center">
      <h2 className="text-3xl font-bold mb-4">
        Verify Authentic Swadeshi Products
      </h2>

      <p className="mb-8 opacity-90">
        Ensure the product you buy is genuine and artisan-made.
      </p>

      <Link
        to="/verify"
        className="bg-white text-green-700 px-8 py-3 rounded-full font-semibold hover:scale-105 transition"
      >
        Verify Now
      </Link>
    </section>
  );
};

export default VerificationCTA;