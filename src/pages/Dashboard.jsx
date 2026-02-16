import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

function Dashboard() {

  const [heritageCount, setHeritageCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [artisanCount, setArtisanCount] = useState(0);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {

    const heritageSnapshot = await getDocs(collection(db, "heritage"));
    const productSnapshot = await getDocs(collection(db, "products"));
    const artisanSnapshot = await getDocs(collection(db, "artisans"));

    setHeritageCount(heritageSnapshot.size);
    setProductCount(productSnapshot.size);
    setArtisanCount(artisanSnapshot.size);

  };

  return (

    <div>

      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        BharatRoots Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Heritage Card */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-blue-600">
            Heritage Items
          </h3>
          <p className="text-3xl font-bold mt-2">
            {heritageCount}
          </p>
        </div>

        {/* Products Card */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-green-600">
            Swadeshi Products
          </h3>
          <p className="text-3xl font-bold mt-2">
            {productCount}
          </p>
        </div>

        {/* Artisans Card */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-purple-600">
            Registered Artisans
          </h3>
          <p className="text-3xl font-bold mt-2">
            {artisanCount}
          </p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
