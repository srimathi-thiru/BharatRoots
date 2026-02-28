import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

const ArtisanLogin = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid login credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F7F4]">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          Artisan Login
        </h2>

        {error && (
          <p className="text-red-500 mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded mb-3"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded mb-4"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
          >
            Login
          </button>

        </form>

        {/* 🔽 REGISTER LINK ADDED */}
        <p className="mt-4 text-center text-sm">
          New Artisan?
          <Link
            to="/register-artisan"
            className="text-green-600 ml-2 font-medium"
          >
            Register Here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default ArtisanLogin;