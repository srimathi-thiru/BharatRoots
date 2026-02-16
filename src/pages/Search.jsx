import React, { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

function Search() {

  const [query, setQuery] = useState("");
  const [heritageResults, setHeritageResults] = useState([]);
  const [productResults, setProductResults] = useState([]);

  const handleSearch = async (value) => {

    setQuery(value);

    if (!value) {
      setHeritageResults([]);
      setProductResults([]);
      return;
    }

    const heritageSnapshot = await getDocs(collection(db, "heritage"));
    const productSnapshot = await getDocs(collection(db, "products"));

    // FIXED: use title instead of name
    const heritageFiltered = heritageSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(item =>
        item.title?.toLowerCase().includes(value.toLowerCase()) ||
        item.category?.toLowerCase().includes(value.toLowerCase()) ||
        item.region?.toLowerCase().includes(value.toLowerCase())
      );

    const productFiltered = productSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(item =>
        item.name?.toLowerCase().includes(value.toLowerCase()) ||
        item.description?.toLowerCase().includes(value.toLowerCase())
      );

    setHeritageResults(heritageFiltered);
    setProductResults(productFiltered);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">

      <h1 className="text-3xl font-bold mb-6">Global Search</h1>

      <input
        type="text"
        placeholder="Search heritage, products..."
        className="w-full p-3 border rounded mb-6"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />

      {/* Heritage Results */}
      {heritageResults.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-2">Heritage Results</h2>

          {heritageResults.map(item => (
            <div key={item.id} className="border p-3 mb-2 rounded bg-white shadow">
              <h3 className="font-bold text-blue-600">{item.title}</h3>
              <p className="text-gray-600">{item.region}</p>
            </div>
          ))}
        </>
      )}

      {/* Product Results */}
      {productResults.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-6 mb-2">Product Results</h2>

          {productResults.map(item => (
            <div key={item.id} className="border p-3 mb-2 rounded bg-white shadow">
              <h3 className="font-bold text-green-600">{item.name}</h3>
              <p className="text-gray-600">₹{item.price}</p>
            </div>
          ))}
        </>
      )}

    </div>
  );
}

export default Search;
