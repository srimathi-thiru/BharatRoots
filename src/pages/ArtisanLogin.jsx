import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const ArtisanLogin = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back, Master Artisan!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Invalid login credentials");
    }
    
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Visual Half */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-900">
        <img 
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80" 
          alt="Master Artisan" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/40 to-transparent"></div>
        <div className="absolute bottom-16 left-16 right-16 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Creator Portal</span>
            </div>
            <h2 className="text-5xl font-display font-bold text-white mb-4 leading-tight">
              Empowering the <br /><span className="text-amber-500 italic">Hands of India</span>
            </h2>
            <p className="text-zinc-300 text-lg font-light leading-relaxed max-w-lg">
              Manage your digital storefront, authenticate your crafts, and connect directly with patrons worldwide.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form Half */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-[#FCFAFA]">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <Link to="/" className="inline-flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity">
              <div className="p-1.5 bg-zinc-900 rounded-lg shadow-md">
                <img src="/bharatroots-logo.svg" alt="BharatRoots Logo" className="h-6 w-6 filter brightness-0 invert" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <span className="text-xl font-black tracking-tight text-zinc-900 font-display">
                Bharat<span className="text-amber-600 font-normal">Roots</span>
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">Artisan Login</h1>
            <p className="text-zinc-500 font-light">Access your creator dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="artisan@example.com"
                className="w-full p-4 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-4 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-zinc-200 hover:bg-black hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? "Accessing Workspace..." : "Enter Workspace"}
            </button>
          </form>

          <p className="mt-8 text-center text-zinc-500 text-sm">
            Not registered as an artisan yet? 
            <Link to="/register-artisan" className="text-amber-600 font-bold ml-2 hover:underline">
              Apply Here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ArtisanLogin;