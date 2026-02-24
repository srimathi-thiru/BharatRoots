import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

function UserLogin() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState(""); // email or mobile
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // If mobile number entered → convert to email format
      const email = identifier.includes("@")
        ? identifier
        : `${identifier}@bharatroots.com`;

      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          User Login
        </h2>

        {error && (
          <p className="text-red-500 mb-4 text-center">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Email or Mobile Number"
          className="w-full p-3 border rounded mb-4"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
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
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-sm">
          New user?
          <Link
            to="/register/user"
            className="text-indigo-600 ml-2 font-medium"
          >
            Register New
          </Link>
        </p>
      </form>
    </div>
  );
}

export default UserLogin;