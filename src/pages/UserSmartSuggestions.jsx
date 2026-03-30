import React, { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import { MdOutlineLightbulb, MdTrendingUp, MdShoppingBag } from "react-icons/md";
import { Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

const UserSmartSuggestions = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(query(collection(db, "products"), limit(6)));
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        // Sort by newest
        data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setProducts(data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <PageWrapper className="w-full bg-[#FAF7F2] min-h-[90vh] pb-24 px-4 md:px-8 py-10 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50/40 hidden lg:block" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}></div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="mb-14 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-200/50 border border-stone-300 mb-6 font-sans">
              <MdOutlineLightbulb className="text-stone-700" size={16} />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">Discovery Engine</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-stone-900 font-display">
              Curated <span className="text-orange-600 italic">For You.</span>
            </h1>
            <p className="mt-6 text-lg text-stone-600 leading-relaxed max-w-xl">
              Discover the latest authentic handmade crafts freshly listed by verified artisans on the platform.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-5 min-w-[200px]">
            <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0 border border-orange-100">
              <MdOutlineLightbulb size={28} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1 mt-1 font-sans">Fresh Drops</p>
              <p className="text-2xl font-bold text-stone-800">{products.length} <span className="text-sm font-medium text-stone-400">new items</span></p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200">
            <MdShoppingBag className="text-stone-300 mx-auto mb-4" size={48} />
            <p className="text-stone-500 font-bold">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, i) => (
              <div key={product.id} className="bg-white border border-stone-200 p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow group relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                  {product.imageUrl && (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover rounded-2xl mb-6 border border-stone-100" />
                  )}
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4 shadow-sm border border-amber-200">
                    <MdTrendingUp size={24} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2 font-sans">New Arrival</p>
                  <h3 className="text-xl font-display font-bold text-stone-900 mb-3 line-clamp-1">{product.name}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed mb-4 line-clamp-2">{product.description}</p>
                  <p className="text-lg font-black text-indigo-600 mb-6">₹{product.price}</p>
                  <Link to={`/product/${product.id}`} className="text-amber-700 font-bold text-sm tracking-widest uppercase hover:text-amber-500 transition-colors flex items-center gap-2">
                    View Product &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default UserSmartSuggestions;
