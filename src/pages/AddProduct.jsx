import React, { useState, useContext } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

function AddProduct() {

  const { currentUser } = useContext(AuthContext);
  const [imageUrl, setImageUrl] = useState("");


  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // simple authenticity hash generator
  const generateHash = (data) => {
    return btoa(data + Date.now());
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const hash = generateHash(name + description + price);

      await addDoc(collection(db, "products"), {
        artisanId: currentUser.uid,
        name,
        description,
        price,
        imageUrl,
        authenticityHash: hash,
        createdAt: new Date()
      });

      toast.success("Product added successfully ✅");

      setName("");
      setDescription("");
      setPrice("");

    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>

      <h2>Add Swadeshi Product</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <br /><br />

        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <br /><br />
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
          required
        />
        <br /><br />  
        <button type="submit">Add Product</button>

      </form>

    </div>
  );
}

export default AddProduct;
