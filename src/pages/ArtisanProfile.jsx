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
import { useParams, Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { MdVerified, MdLocationOn, MdBrush, MdPhone } from "react-icons/md";

function ArtisanProfile() {
  const { artisanId } = useParams();
  const [artisan, setArtisan] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtisanAndProducts();
  }, []);

  const fetchArtisanAndProducts = async () => {
    setLoading(true);
    const artisanRef = doc(db, "artisans", artisanId);
    const artisanSnap = await getDoc(artisanRef);

    if (artisanSnap.exists()) {
      setArtisan(artisanSnap.data());
      
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
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <PageWrapper className="min-h-screen flex items-center justify-center bg-[#FCFAFA]">
         <div className="text-zinc-500 font-bold uppercase tracking-widest text-sm animate-pulse">Loading Artisan Profile...</div>
      </PageWrapper>
    );
  }

  if (!artisan) {
    return (
        <PageWrapper className="min-h-screen flex items-center justify-center bg-[#FCFAFA]">
            <div className="text-center">
              <h2 className="text-2xl font-black text-zinc-900 font-display">Artisan Not Found</h2>
              <p className="text-zinc-500 mt-2">The artisan profile you are looking for does not exist.</p>
            </div>
        </PageWrapper>
    );
  }

  return (
    <PageWrapper className="py-12 px-4 max-w-7xl mx-auto min-h-screen">
      
      {/* Artisan Identity Header */}
      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-zinc-200 mb-10 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pattern-dots pointer-events-none"></div>

         <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
            <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 bg-zinc-900 text-amber-400 rounded-full flex items-center justify-center text-6xl font-black font-display shadow-xl ring-4 ring-[#FCFAFA]">
               {artisan.name[0].toUpperCase()}
            </div>
            
            <div className="text-center md:text-left flex-grow">
               <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                 <h1 className="text-4xl md:text-5xl font-black font-display text-zinc-900 tracking-tight">
                   {artisan.name}
                 </h1>
                 {artisan.verified && (
                   <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full w-max mx-auto md:mx-0 shadow-sm">
                     <MdVerified size={14} /> Swadeshi Verified
                   </span>
                 )}
               </div>

               <p className="text-zinc-500 font-medium text-lg max-w-2xl mb-6">
                 Master artisan specializing in traditional {artisan.specialization.toLowerCase()}. Preserving heritage through generations of craftsmanship.
               </p>

               <div className="flex flex-wrap justify-center md:justify-start gap-4">
                 <div className="flex items-center gap-2 bg-[#FCFAFA] px-4 py-2 rounded-xl border border-zinc-100 shadow-inner">
                   <MdLocationOn className="text-amber-500" size={18} />
                   <span className="text-sm font-medium text-zinc-700">{artisan.region}</span>
                 </div>
                 <div className="flex items-center gap-2 bg-[#FCFAFA] px-4 py-2 rounded-xl border border-zinc-100 shadow-inner">
                   <MdBrush className="text-indigo-500" size={18} />
                   <span className="text-sm font-medium text-zinc-700">{artisan.specialization}</span>
                 </div>
                 <div className="flex items-center gap-2 bg-[#FCFAFA] px-4 py-2 rounded-xl border border-zinc-100 shadow-inner">
                   <MdPhone className="text-emerald-500" size={18} />
                   <span className="text-sm font-medium text-zinc-700">{artisan.contact}</span>
                 </div>
               </div>
            </div>
         </div>
      </div>

      <div className="mb-10">
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6 pb-2 border-b border-zinc-200">
          Collection by {artisan.name.split(' ')[0]}
        </h2>

        {products.length === 0 ? (
           <div className="bg-[#FCFAFA] p-12 rounded-[2rem] border border-zinc-200 border-dashed text-center">
             <p className="text-zinc-500 font-medium">This artisan hasn't listed any products yet.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <Link key={product.id} to={`/product/${product.id}`} className="group h-full">
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                   <div className="relative h-48 overflow-hidden bg-zinc-100">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-300">
                           <MdBrush size={48} />
                        </div>
                      )}
                   </div>

                   <div className="p-5 flex flex-col flex-grow">
                     <h3 className="text-lg font-bold font-display text-zinc-900 mb-1 group-hover:text-amber-600 transition-colors line-clamp-1">
                       {product.name}
                     </h3>
                     <p className="text-indigo-600 font-black mb-3">
                       ₹{product.price}
                     </p>
                   </div>
                 </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </PageWrapper>
  );
}

export default ArtisanProfile;
