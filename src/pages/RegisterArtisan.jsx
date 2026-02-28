import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function RegisterArtisan() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [contact, setContact] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      // STEP 1 — Create Auth User
      const userCredential =
        await createUserWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;

      console.log("Auth created:", user.uid);

      // STEP 2 — Create Artisan Profile
      const docRef = await addDoc(collection(db, "artisans"), {
        userId: user.uid,
        name,
        region,
        specialization,
        contact,
        verified: false,
        createdAt: new Date()
      });

      console.log("Artisan profile created:", docRef.id);

      alert("Artisan registered successfully ✅");
      navigate("/dashboard");

    } catch (error) {
      console.error("Registration error:", error);
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Register as Artisan</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
          required
        />
        <br/><br/>

        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
          required
        />
        <br/><br/>

        <input
          type="text"
          placeholder="Artisan Name"
          onChange={(e)=>setName(e.target.value)}
          required
        />
        <br/><br/>

        <input
          type="text"
          placeholder="Region"
          onChange={(e)=>setRegion(e.target.value)}
          required
        />
        <br/><br/>

        <input
          type="text"
          placeholder="Specialization"
          onChange={(e)=>setSpecialization(e.target.value)}
          required
        />
        <br/><br/>

        <input
          type="text"
          placeholder="Contact"
          onChange={(e)=>setContact(e.target.value)}
          required
        />
        <br/><br/>

        <button type="submit">
          Register Artisan
        </button>

      </form>
    </div>
  );
}

export default RegisterArtisan;