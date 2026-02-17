import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

function Verify() {

  const [code, setCode] = useState("");
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("");

  const handleVerify = async () => {

    if (!code.trim()) {
      setStatus("Please enter authenticity code");
      setProduct(null);
      return;
    }

    setStatus("Verifying...");
    setProduct(null);

    try {

      const snapshot = await getDocs(collection(db, "products"));

      let found = null;

      snapshot.forEach(doc => {

        const data = doc.data();

        if (data.authenticityHash === code.trim()) {

          found = {
            id: doc.id,
            ...data
          };

        }

      });

      if (found) {

        setProduct(found);
        setStatus("valid");

      } else {

        setStatus("invalid");

      }

    } catch (error) {

      console.error(error);
      setStatus("error");

    }

  };

  return (

    <div className="max-w-3xl mx-auto mt-10">

      <h1 className="text-3xl font-bold mb-6">
        Verify Swadeshi Product Authenticity
      </h1>

      {/* Input */}
      <div className="flex gap-3">

        <input
          type="text"
          placeholder="Enter authenticity code"
          className="flex-1 p-3 border rounded"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button
          onClick={handleVerify}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Verify
        </button>

      </div>

      {/* Status Messages */}

      {status === "verifying" && (
        <p className="mt-4 text-blue-600">Verifying...</p>
      )}

      {status === "invalid" && (
        <p className="mt-4 text-red-600 font-semibold">
          ❌ Invalid or fake product code
        </p>
      )}

      {status === "valid" && product && (

        <div className="mt-6 bg-white shadow-lg rounded-lg p-6">

          <p className="text-green-600 font-bold text-lg mb-3">
            ✅ Authentic Swadeshi Certified Product
          </p>

          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-64 object-cover rounded mb-4"
          />

          <h2 className="text-xl font-bold">{product.name}</h2>

          <p className="text-gray-600">{product.description}</p>

          <p className="text-green-600 font-bold mt-2">
            ₹{product.price}
          </p>

          <p className="text-xs text-gray-400 mt-2 break-all">
            Code: {product.authenticityHash}
          </p>

        </div>

      )}

    </div>

  );

}

export default Verify;
