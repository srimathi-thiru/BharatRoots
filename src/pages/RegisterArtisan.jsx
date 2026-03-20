import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function RegisterArtisan() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store Role in users collection so login works properly like UserLogin
      await setDoc(doc(db, "users", user.uid), {
        role: "artisan",
        email: email,
        mobile: contact,
        createdAt: new Date()
      });

      // Create Artisan Profile
      await addDoc(collection(db, "artisans"), {
        userId: user.uid,
        name,
        region,
        specialization,
        contact,
        verified: false,
        createdAt: new Date()
      });

      toast.success("Artisan registered successfully ✅");
      navigate("/dashboard");

    } catch (error) {
      toast.error(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Visual Half */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-zinc-950 order-2">
        <img 
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80" 
          alt="Artisan Crafting" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/50 to-transparent"></div>
        <div className="absolute top-16 right-16 z-10 text-right w-full flex flex-col items-end">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 mb-6">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Master Network</span>
            </div>
            <h2 className="text-5xl font-display font-bold text-white mb-4 leading-tight">
              Bring Your Craft <br /><span className="text-amber-500 italic">to the World</span>
            </h2>
            <p className="text-zinc-300 text-lg font-light leading-relaxed max-w-sm ml-auto">
              Join BharatRoots as a verified artisan to establish direct connections with appreciators of true Swadeshi art. No middlemen, full value.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form Half */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-[#FCFAFA] order-1 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl"
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
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">Artisan Registration</h1>
            <p className="text-zinc-500 font-light">Provide your details to initiate the verification process.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-1.5">Artisan Name / Studio</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full p-4 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                  onChange={(e)=>setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-1.5">Primary Material / Craft</label>
                <input
                  type="text"
                  placeholder="e.g. Blue Pottery"
                  className="w-full p-4 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                  onChange={(e)=>setSpecialization(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-1.5">Region / City</label>
                <input
                  type="text"
                  placeholder="e.g. Jaipur, Rajasthan"
                  className="w-full p-4 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                  onChange={(e)=>setRegion(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-1.5">Contact Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  className="w-full p-4 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                  onChange={(e)=>setContact(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200">
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="artisan@example.com"
                className="w-full p-4 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none mb-5"
                onChange={(e)=>setEmail(e.target.value)}
                required
              />

              <label className="block text-sm font-bold text-zinc-700 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-4 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                onChange={(e)=>setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-zinc-200 hover:bg-black hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
            >
              {loading ? "Submitting Application..." : "Submit Registration"}
            </button>
          </form>

          <p className="mt-8 text-center text-zinc-500 text-sm">
            Already registered? 
            <Link to="/login/artisan" className="text-amber-600 font-bold ml-2 hover:underline">
              Access Dashboard
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default RegisterArtisan;