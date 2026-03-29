import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import PageWrapper from "../components/PageWrapper";
import { AuthContext } from "../context/AuthContext";
import { FaArrowLeft, FaMapMarkerAlt, FaFeatherAlt, FaShieldAlt } from "react-icons/fa";

function HeritageDetail() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { userRole } = useContext(AuthContext);
  const [heritage, setHeritage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeritage = async () => {
      try {
        const docRef = doc(db, "heritage", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // Check if pending and user is NOT admin
          if (data.status === "pending" && userRole?.toLowerCase() !== "admin") {
            setHeritage(null);
          } else {
            setHeritage(data);
          }
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

  if (loading) return <h2 className="text-center mt-20 text-zinc-500 font-bold">Loading Heritage Document...</h2>;
  if (!heritage) return <h2 className="text-center mt-20 text-zinc-500 font-bold">Heritage Not Found</h2>;

  return (
    <PageWrapper className="p-4 md:p-8 bg-[#FCFAFA] min-h-screen">
      
      <button 
        onClick={() => navigate('/heritage')}
        className="mb-6 flex flex-row items-center gap-2 text-sm font-bold text-zinc-500 hover:text-indigo-600 transition-colors uppercase tracking-widest mx-auto max-w-7xl"
      >
        <FaArrowLeft /> Back to Catalog
      </button>

      <div className="max-w-7xl mx-auto bg-white rounded-[2rem] shadow-sm border border-zinc-200 overflow-hidden">
        
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* Left: Image Box */}
          <div className="relative h-[400px] lg:h-auto bg-zinc-100">
            <img
              src={heritage.imageUrl}
              alt={heritage.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>

          {/* Right: Content Details */}
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                <FaFeatherAlt size={10} /> {heritage.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black font-display text-zinc-900 mb-6 tracking-tight leading-tight">
              {heritage.title}
            </h1>

            <p className="text-zinc-600 font-medium mb-10 flex items-center gap-2 bg-[#FCFAFA] p-4 rounded-xl border border-zinc-100 w-max">
              <span className="bg-amber-100 text-amber-600 p-2 rounded-lg">
                <FaMapMarkerAlt size={16} />
              </span>
              <span className="text-lg">Geotagged: <span className="font-bold text-zinc-900">{heritage.region}</span></span>
            </p>

            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 border-b border-zinc-100 pb-2">Historical Description</h3>
            <p className="text-zinc-600 text-lg leading-relaxed">
              {heritage.description}
            </p>

          </div>

        </div>

      </div>
    </PageWrapper>
  );
}

export default HeritageDetail;