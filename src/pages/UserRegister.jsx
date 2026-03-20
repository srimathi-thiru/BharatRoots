import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function UserRegister() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalEmail = email || `${mobile}@bharatroots.com`;

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        finalEmail,
        password
      );

      const user = userCredential.user;

      // 🔥 Store role in Firestore
      await setDoc(doc(db, "users", user.uid), {
        role: "user",
        email: finalEmail,
        mobile: mobile || "",
        createdAt: new Date()
      });

      toast.success("Registration successful!");
      navigate("/dashboard");

    } catch (err) {
      toast.error(err.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Visual Half */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-indigo-950 order-2">
        <img 
          src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=80" 
          alt="Indian Ceramic Art" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-900/50 to-transparent"></div>
        <div className="absolute bottom-16 left-16 right-16 z-10 text-right flex flex-col items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-6">
              <span className="text-xs font-bold text-white uppercase tracking-widest">Join the Movement</span>
            </div>
            <h2 className="text-5xl font-display font-bold text-white mb-4 leading-tight">
              Support <br /><span className="text-indigo-300 italic">Authenticity</span>
            </h2>
            <p className="text-indigo-100 text-lg font-light leading-relaxed max-w-sm ml-auto">
              Create an account to verify artifacts, secure your purchases, and trace the heritage of every masterpiece.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form Half */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-[#FAF7F2] order-1">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <Link to="/" className="inline-flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity">
              <div className="p-1.5 bg-indigo-600 rounded-lg shadow-md">
                <img src="/bharatroots-logo.svg" alt="BharatRoots Logo" className="h-6 w-6 filter brightness-0 invert" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 font-display">
                Bharat<span className="text-indigo-600 font-normal">Roots</span>
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create an Account</h1>
            <p className="text-slate-500 font-light">Join the digital heritage ecosystem.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Email <span className="text-slate-400 font-normal">(Optional)</span></label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Mobile Number</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 text-sm">
            Already have an account? 
            <Link to="/login/user" className="text-indigo-600 font-bold ml-2 hover:underline">
              Log in instead
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default UserRegister;