import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { useParams } from "react-router-dom";

function ArtisanProfile() {

  const { artisanId } = useParams();

  const [artisan, setArtisan] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchArtisan();
    fetchProducts();
  }, []);

  const fetchArtisan = async () => {

    const artisanRef = doc(db, "artisans", artisanId);
    const artisanSnap = await getDoc(artisanRef);

    if (artisanSnap.exists()) {
      setArtisan(artisanSnap.data());
    }
  };

  const fetchProducts = async () => {

    const q = query(
      collection(db, "products"),
      where("artisanId", "==", artisanId)
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setProducts(data);
  };

  if (!artisan) {
        return (
            <div className="text-center mt-10">
            Artisan not found or still loading...
            </div>
        );
        }


  return (
    <div className="max-w-4xl mx-auto mt-10">

      <h1 className="text-3xl font-bold mb-4">
        Artisan Profile
      </h1>

      <div className="bg-white p-6 rounded shadow mb-6">

        <h2 className="text-2xl font-semibold">
          {artisan.name}
        </h2>

        {artisan.verified && (
          <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full mt-2">
            ✔ Verified Artisan
          </span>
        )}

        <p className="mt-2">
          Region: {artisan.region}
        </p>

        <p>
          Specialization: {artisan.specialization}
        </p>

        <p>
          Contact: {artisan.contact}
        </p>

      </div>

      <h2 className="text-xl font-bold mb-3">
        Products by this artisan
      </h2>

      {products.map(product => (

        <div
          key={product.id}
          className="bg-white p-4 mb-3 rounded shadow"
        >
          <h3 className="font-semibold">
            {product.name}
          </h3>

          <p>
            ₹{product.price}
          </p>

        </div>

      ))}

    </div>
  );
}

export default ArtisanProfile;
