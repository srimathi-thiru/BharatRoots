import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

function AddHeritage() {

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Monument");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "heritage"), {
        title: title,
        category: category,
        region: region,
        description: description,
        createdAt: new Date()
      });

      alert("Heritage added successfully ✅");

      setTitle("");
      setRegion("");
      setDescription("");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Heritage</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Heritage Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <br /><br />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Monument">Monument</option>
          <option value="Craft">Craft</option>
          <option value="Festival">Festival</option>
        </select>

        <br /><br />

        <input
          type="text"
          placeholder="Region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          required
        />

        <br /><br />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">Add Heritage</button>

      </form>
    </div>
  );
}

export default AddHeritage;
