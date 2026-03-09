import { Link } from "react-router-dom";

const VerificationCTA = () => {
  return (
    <section className="w-full py-20 bg-gradient-to-r from-green-700 to-green-400 text-white">

  <div className="max-w-7xl mx-auto px-6 text-center">

    <h2 className="text-3xl font-bold mb-4">
      Verify Authentic Swadeshi Products
    </h2>

    <p className="mb-6 opacity-90">
      Ensure the product you buy is genuine and artisan-made.
    </p>

    <button className="bg-white text-green-700 px-8 py-3 rounded-full font-semibold hover:scale-105 transition">
      Verify Now
    </button>

  </div>

</section>
  );
};

export default VerificationCTA;