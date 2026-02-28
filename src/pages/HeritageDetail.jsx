import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

function HeritageDetail() {

  const { id } = useParams();
  const [heritage, setHeritage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeritage = async () => {
      try {
        const docRef = doc(db, "heritage", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHeritage(docSnap.data());
        } else {
          console.log("No such heritage found!");
        }
      } catch (error) {
        console.error("Error fetching heritage:", error);
      }
      setLoading(false);
    };

    fetchHeritage();
  }, [id]);

  if (loading) return <h2 className="text-center mt-10">Loading...</h2>;
  if (!heritage) return <h2 className="text-center mt-10">Heritage Not Found</h2>;

  return (
    <div className="min-h-screen p-8 bg-amber-50">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">

        <img
          src={heritage.imageUrl}
          alt={heritage.title}
          className="w-full h-80 object-cover rounded-lg mb-6"
        />

        <h1 className="text-3xl font-bold text-orange-800 mb-2">
          {heritage.title}
        </h1>

        <p className="text-gray-600 mb-4">
          📍 {heritage.region}
        </p>

        <p className="text-sm text-gray-500 mb-2">
          Category: {heritage.category}
        </p>

        <h3 className="text-xl font-semibold mt-4">Description</h3>
        <p className="text-gray-700">{heritage.description}</p>

      </div>
    </div>
  );
}

export default HeritageDetail;