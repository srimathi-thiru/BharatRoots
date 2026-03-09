import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

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

      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Cultural Heritage
      </h2>

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

            <p className="text-sm text-gray-500 mb-2">
              Category: {item.category}
            </p>

            <p className="text-sm text-gray-500 mb-2">
              Region: {item.region}
            </p>

            <p className="text-gray-700">
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
