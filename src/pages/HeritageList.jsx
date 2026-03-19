import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import HeritageMap from "../components/HeritageMap";

function HeritageList() {

  const [heritageList, setHeritageList] = useState([]);

  useEffect(() => {
    fetchHeritage();
  }, []);

  const fetchHeritage = async () => {

    const querySnapshot = await getDocs(collection(db, "heritage"));

    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setHeritageList(data);
  };

  return (

    <PageWrapper>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Cultural Heritage Regions
        </h2>
      </div>

      {/* Map Visualization */}
      <div className="mb-12">
        <HeritageMap />
        <p className="text-sm text-gray-500 mt-2 text-center">
          Interactive map powered by AI geographical tagging. Darker regions indicate higher concentrations of mapped heritage.
        </p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Explore Catalog
      </h3>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {heritageList.map(item => (
        <Link key={item.id} to={`/heritage/${item.id}`}>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />


            <h3 className="text-xl font-semibold text-blue-600 mb-2">
              {item.title}
            </h3>

            <p className="text-sm border-l-2 border-indigo-400 pl-2 text-gray-500 mb-2 font-medium">
              Geotagged: {item.region}
            </p>

            <div className="flex items-center gap-2 mb-4">
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                {item.category}
              </span>
            </div>

            <p className="text-gray-700 line-clamp-3">
              {item.description}
            </p>

           </div>
          </Link>
          ))}

      </div>

    </PageWrapper>

  );
}

export default HeritageList;
