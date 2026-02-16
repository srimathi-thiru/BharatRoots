import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

function VerifyProduct() {

  const [hash, setHash] = useState("");
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");

  const verifyProduct = async () => {

    try {

      const q = query(
        collection(db, "products"),
        where("authenticityHash", "==", hash)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {

        setMessage("❌ Product not found. Possible counterfeit.");
        setProduct(null);

      } else {

        const doc = querySnapshot.docs[0];

        setProduct(doc.data());
        setMessage("✅ Authentic Swadeshi Product Verified");

      }

    } catch (error) {

      console.error(error);

    }

  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>Verify Swadeshi Product Authenticity</h2>

      <input
        type="text"
        placeholder="Enter authenticity code"
        value={hash}
        onChange={(e) => setHash(e.target.value)}
        style={{ width: "300px" }}
      />

      <br /><br />

      <button onClick={verifyProduct}>
        Verify Product
      </button>

      <br /><br />

      <h3>{message}</h3>

      {product && (
        <div style={{
          border: "1px solid green",
          padding: "10px",
          marginTop: "10px"
        }}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>Price: ₹{product.price}</p>
        </div>
      )}

    </div>
  );
}

export default VerifyProduct;
