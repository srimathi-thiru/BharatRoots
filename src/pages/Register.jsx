import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";

import {
  createUserWithEmailAndPassword
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

import { useNavigate, Link } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      // Create Firebase Auth user
      const userCredential =
        await createUserWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;

      // Save role in Firestore
      await setDoc(doc(db, "users", user.uid), {

        email: email,
        role: role,
        createdAt: serverTimestamp()

      });

      alert("Registration successful");

      navigate("/dashboard");

    }
    catch (err) {

      setError(err.message);

    }

    setLoading(false);

  };

  return (

    <div className="flex justify-center items-center min-h-screen">

      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Register
        </h2>

        {error && (
          <p className="text-red-500 mb-3">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Role selection */}
        <select
          className="w-full p-2 border mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="USER">User</option>
          <option value="ARTISAN">Artisan</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-4 text-center">
          Already have account?
          <Link to="/login" className="text-blue-600 ml-2">
            Login
          </Link>
        </p>

      </form>

    </div>

  );

}

export default Register;
