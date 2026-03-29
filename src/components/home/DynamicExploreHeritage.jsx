import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, query, limit, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const DynamicExploreHeritage = () => {
  const [heritageList, setHeritageList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeritage();
  }, []);

  const fetchHeritage = async () => {
    try {
      const cached = sessionStorage.getItem("bharatroots_exploreHeritage");
      if (cached) {
        setHeritageList(JSON.parse(cached));
        setLoading(false);
      } else {
        setLoading(true);
      }

      const heritageRef = collection(db, "heritage");
      const querySnapshot = await getDocs(heritageRef);

      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).filter(doc => doc.status !== "pending").slice(0, 3);

      setHeritageList(data);
      sessionStorage.setItem("bharatroots_exploreHeritage", JSON.stringify(data));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching heritage items:", error);
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-32 bg-white relative overflow-hidden">
      {/* Decorative text */}
      <div className="absolute top-10 left-10 text-[10rem] md:text-[14rem] font-black text-slate-50 select-none -z-10 tracking-tighter leading-none">
        ARCHIVE
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 font-display italic">
            Living Heritage Archive
          </h2>
          <p className="text-slate-500 font-light text-lg">
            A high-fidelity digital repository preserving centuries of folklore, craft techniques, and cultural wisdom. Delve into stories of our past.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {loading && heritageList.length === 0 ? (
            // SKELETON LOADERS
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center">
                 <div className="w-64 h-64 md:w-56 md:h-56 rounded-full bg-slate-200 animate-pulse mb-8"></div>
                 <div className="w-3/4 h-6 bg-slate-200 rounded animate-pulse mb-4"></div>
                 <div className="w-1/2 h-4 bg-slate-200 rounded animate-pulse mb-4"></div>
                 <div className="w-full h-16 bg-slate-200 rounded animate-pulse"></div>
              </div>
            ))
          ) : (
            heritageList.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="group flex flex-col items-center text-center"
              >
                <div className="relative w-64 h-64 md:w-56 md:h-56 mx-auto mb-8">
                   <div className="absolute inset-0 rounded-full border-2 border-indigo-200 group-hover:scale-110 transition-transform duration-500"></div>
                   <div className="absolute inset-2 rounded-full overflow-hidden transition-all duration-700 shadow-xl">
                      <img 
                        src={item.imageUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                   </div>
                </div>
                
                <h3 className="font-display font-bold text-2xl text-slate-900 mb-2">{item.title}</h3>
                <p className="text-indigo-600 font-bold text-sm tracking-widest uppercase mb-3">{item.category}</p>
                <p className="text-slate-500 text-sm font-light line-clamp-3 px-4 mb-6">
                  {item.description}
                </p>
                
                <Link 
                  to={`/heritage/${item.id}`}
                  className="mt-auto px-6 py-2 border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300"
                >
                   Read Full Story
                </Link>
              </motion.div>
            ))
          )}
        </div>

        <div className="mt-24 text-center">
            <Link 
              to="/heritage"
              className="inline-flex items-center gap-2 text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1 hover:text-indigo-800 transition-colors"
            >
              View Full Heritage Map <span>→</span>
            </Link>
        </div>
      </div>
    </section>
  );
};

export default DynamicExploreHeritage;
