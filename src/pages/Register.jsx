import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [region, setRegion] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Store additional data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        role: role,
        region: region,
        createdAt: new Date()
      });

      alert("User registered successfully ✅");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register - BharatRoots</h2>

      <form onSubmit={handleRegister}>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="USER">User</option>
          <option value="ARTISAN">Artisan</option>
          <option value="ADMIN">Admin</option>
        </select>

        <br /><br />

        <input
          type="text"
          placeholder="Region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />

        <br /><br />

        <button type="submit">Register</button>

      </form>
    </div>
  );
}

export default Register;
