import React, { useState, useContext } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

function RegisterArtisan() {

  const { currentUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [contact, setContact] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await addDoc(collection(db, "artisans"), {
        userId: currentUser.uid,
        name: name,
        region: region,
        specialization: specialization,
        contact: contact,
        verified: false,
        createdAt: new Date()
      });

      alert("Artisan registered successfully ✅");

      setName("");
      setRegion("");
      setSpecialization("");
      setContact("");

    } catch (error) {

      alert(error.message);

    }

  };

  return (
    <div>

      <h2>Register as Artisan</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Artisan Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="text"
          placeholder="Region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="text"
          placeholder="Specialization (e.g., Handloom, Pottery)"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="text"
          placeholder="Contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">Register Artisan</button>

      </form>

    </div>
  );
}

export default RegisterArtisan;
