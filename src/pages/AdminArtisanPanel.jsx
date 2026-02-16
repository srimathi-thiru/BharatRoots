import React, { useEffect, useState, useContext } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

function AdminArtisanPanel() {

  const { userRole } = useContext(AuthContext);
  const [artisans, setArtisans] = useState([]);

  useEffect(() => {
    fetchArtisans();
  }, []);

  const fetchArtisans = async () => {

    const snapshot = await getDocs(collection(db, "artisans"));

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setArtisans(data);
  };

  const verifyArtisan = async (id) => {

    const artisanRef = doc(db, "artisans", id);

    await updateDoc(artisanRef, {
      verified: true
    });

    fetchArtisans();
  };

  // Only Admin can access
  if (userRole !== "ADMIN") {
    return <h2 className="text-center mt-10">Access Denied</h2>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">

      <h1 className="text-3xl font-bold mb-6">
        Artisan Verification Panel
      </h1>

      {artisans.map(artisan => (

        <div key={artisan.id}
             className="bg-white p-4 mb-4 rounded shadow">

          <h3 className="text-xl font-bold">
            {artisan.name}
          </h3>

          <p>Specialization: {artisan.specialization}</p>

          <p>
            Status:
            {artisan.verified ? (
              <span className="text-green-600 font-bold ml-2">
                Verified
              </span>
            ) : (
              <span className="text-red-600 font-bold ml-2">
                Not Verified
              </span>
            )}
          </p>

          {!artisan.verified && (
            <button
              onClick={() => verifyArtisan(artisan.id)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Verify Artisan
            </button>
          )}

        </div>

      ))}

    </div>
  );
}

export default AdminArtisanPanel;
