import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function LandingPage() {

  return (

    <div className="min-h-screen w-full overflow-x-hidden bg-white">

      {/* ================= NAVBAR ================= */}

      <nav className="fixed top-0 w-full z-50 
      bg-gradient-to-r from-blue-900/90 via-blue-800/90 to-blue-900/90
      backdrop-blur-md border-b border-white/10 shadow-lg">

        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

          {/* Logo */}
          <h1 className="text-2xl font-bold text-white tracking-wide drop-shadow-lg">
            BharatRoots
          </h1>

          {/* Actions */}
          <div className="space-x-4">

            <Link
              to="/login"
              className="text-white/90 font-medium hover:text-yellow-300 transition duration-300"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 
              text-blue-900 px-6 py-2 rounded-full font-semibold
              hover:scale-105 transition duration-300 shadow-md"
            >
              Get Started
            </Link>

          </div>

        </div>

      </nav>


      {/* ================= HERO SECTION ================= */}

      <section className="relative min-h-screen flex items-center justify-center">

        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1583391733956-6c77a91c4f3c?auto=format&fit=crop&w=1950&q=80"
          alt="Indian Culture"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 
        bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-orange-500/80">
        </div>


        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative text-center text-white px-6 max-w-4xl"
        >

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">

            Digital Platform for

            <span className="block text-yellow-300 mt-2">
              Swadeshi Heritage
            </span>

          </h1>


          <p className="text-lg md:text-xl mb-8 text-gray-200">

            Discover India's rich cultural heritage, connect with authentic artisans,
            and verify traditional Swadeshi products using BharatRoots.

          </p>


          {/* Buttons */}
          <div className="flex justify-center gap-4 flex-wrap">

            <Link
              to="/register"
              className="bg-white text-blue-900 px-8 py-3 rounded-full 
              font-semibold hover:bg-gray-200 transition duration-300 shadow-md"
            >
              Join Now
            </Link>


            <Link
              to="/login"
              className="border border-white px-8 py-3 rounded-full 
              hover:bg-white hover:text-blue-900 transition duration-300"
            >
              Login
            </Link>

          </div>

        </motion.div>

      </section>



      {/* ================= FEATURES SECTION ================= */}

      <section className="py-20 bg-gray-50">

        <div className="max-w-6xl mx-auto text-center px-6">

          <h2 className="text-4xl font-bold mb-14 text-gray-800">

            Platform Features

          </h2>


          <div className="grid md:grid-cols-3 gap-10">

            {/* Feature 1 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300"
            >

              <div className="text-4xl mb-4">🏛</div>

              <h3 className="text-xl font-bold mb-3">
                Cultural Heritage Archive
              </h3>

              <p className="text-gray-600">
                Explore India's heritage, traditions, and cultural history digitally.
              </p>

            </motion.div>



            {/* Feature 2 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300"
            >

              <div className="text-4xl mb-4">🛍</div>

              <h3 className="text-xl font-bold mb-3">
                Swadeshi Marketplace
              </h3>

              <p className="text-gray-600">
                Connect directly with verified artisans and authentic products.
              </p>

            </motion.div>



            {/* Feature 3 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300"
            >

              <div className="text-4xl mb-4">✔</div>

              <h3 className="text-xl font-bold mb-3">
                Product Verification
              </h3>

              <p className="text-gray-600">
                Verify authenticity of Swadeshi products using secure digital codes.
              </p>

            </motion.div>


          </div>

        </div>

      </section>



      {/* ================= CALL TO ACTION ================= */}

      <section className="py-20 
      bg-gradient-to-r from-blue-700 via-blue-800 to-orange-500 
      text-white text-center">

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >

          <h2 className="text-4xl font-bold mb-4">

            Join the Swadeshi Movement

          </h2>


          <p className="mb-6 text-gray-200">

            Support artisans, preserve heritage, and promote authentic Swadeshi culture.

          </p>


          <Link
            to="/register"
            className="bg-white text-blue-900 px-8 py-3 rounded-full 
            font-semibold hover:bg-gray-200 transition duration-300 shadow-md"
          >
            Get Started Now
          </Link>


        </motion.div>

      </section>



      {/* ================= FOOTER ================= */}

      <footer className="bg-gray-900 text-white text-center py-6">

        © 2026 BharatRoots. All Rights Reserved.

      </footer>


    </div>

  );

}

export default LandingPage;
