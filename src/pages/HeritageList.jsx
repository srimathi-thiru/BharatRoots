import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import HeritageMap from "../components/HeritageMap";

function HeritageList() {

  const [heritageList, setHeritageList] = useState([]);

  useEffect(() => {
    fetchHeritage();
  }, []);

  async function fetchHeritage() {

    const heritageRef = collection(db, "heritage");
    const querySnapshot = await getDocs(heritageRef);

    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).filter(doc => doc.status !== "pending");

    setHeritageList(data);
  };

  return (

    <PageWrapper className="py-8 px-4 max-w-7xl mx-auto">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-black font-display tracking-tight text-zinc-900">
          Cultural Heritage Regions
        </h2>
      </div>

      {/* Map Visualization */}
      <div className="mb-16 bg-white p-2 md:p-6 rounded-[2rem] shadow-sm border border-zinc-200">
        <HeritageMap />
        <p className="text-xs font-bold text-zinc-400 mt-6 text-center uppercase tracking-widest">
          Interactive map powered by AI geographical tagging. Darker regions indicate higher concentrations.
        </p>
      </div>

      <h3 className="text-3xl font-black font-display text-zinc-900 mb-8">
        Explore Catalog
      </h3>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {heritageList.map(item => (
        <Link key={item.id} to={`/heritage/${item.id}`} className="group h-full">
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
             <div className="relative h-64 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
             </div>

             <div className="p-6 flex flex-col flex-grow">
               <div className="flex items-center gap-2 mb-3">
                 <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-md">
                   {item.category}
                 </span>
               </div>

               <h3 className="text-xl font-bold font-display text-zinc-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                 {item.title}
               </h3>

               <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                 {item.region}
               </p>

               <p className="text-zinc-500 text-sm line-clamp-3 mt-auto">
                 {item.description}
               </p>
             </div>
           </div>
          </Link>
          ))}

      </div>

    </PageWrapper>

  );
}

export default HeritageList;
