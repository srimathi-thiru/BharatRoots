import React, { useState, useContext } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login({ expectedRole }) {
  const navigate = useNavigate();
  const { userRole } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // ⏳ Give AuthContext a moment to load role
      setTimeout(async () => {
        if (expectedRole && userRole !== expectedRole) {
          await signOut(auth);
          setError(`This login is only for ${expectedRole}s`);
          setLoading(false);
          return;
        }

        navigate("/dashboard");
      }, 500);

    } catch (err) {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {expectedRole === "ARTISAN" ? "Artisan Login" : "User Login"}
        </h2>

        {error && (
          <p className="text-red-500 mb-3 text-center">
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {!expectedRole && (
          <p className="mt-4 text-center">
            Don't have an account?
            <Link to="/register" className="text-blue-600 ml-2">
              Register
            </Link>
          </p>
        )}
      </form>
    </div>
  );
}

export default Login;