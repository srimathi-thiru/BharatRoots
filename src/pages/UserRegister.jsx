import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

function UserRegister() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

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

      navigate("/user-dashboard");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F0F7F4]">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          User Registration
        </h2>

        {error && (
          <p className="text-red-500 mb-4 text-center">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email (optional)"
          className="w-full p-3 border rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Mobile Number"
          className="w-full p-3 border rounded mb-3"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
        >
          Register
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account?
          <Link to="/login/user" className="text-green-600 ml-2 font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default UserRegister;