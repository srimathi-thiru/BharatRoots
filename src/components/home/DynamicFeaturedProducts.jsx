import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const DynamicFeaturedProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Fetch some products to feature. For simplicity, we just take the first 4.
      const productsQuery = query(collection(db, "products"), limit(4));
      const querySnapshot = await getDocs(productsQuery);

      const data = querySnapshot.docs.map(docItem => ({
        id: docItem.id,
        ...docItem.data()
      }));

      setProducts(data);
    } catch (error) {
      console.error("Error fetching featured products:", error);
    }
  };

  return (
    <section className="w-full py-32 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-display mb-6 italic">
              The Swadeshi Marketplace
            </h2>
            <p className="text-slate-500 font-light text-lg">
              Authentic masterpieces crafted by verified artisans. Discover pieces that carry the true essence of Indian heritage.
            </p>
          </div>
          <Link 
            to="/products"
            className="text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1 hover:text-indigo-800 transition-colors"
          >
            Explore All Products
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative h-[450px] rounded-[2rem] overflow-hidden shadow-xl"
            >
              <img 
                src={product.imageUrl || "https://images.unsplash.com/photo-1605814571999-566b6e4e082f?auto=format&fit=crop&w=800&q=80"} 
                alt={product.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">₹{product.price}</p>
                <h3 className="text-white text-2xl font-display font-bold mb-3">{product.name}</h3>
                <p className="text-white/80 text-sm font-light leading-relaxed mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {product.description}
                </p>
                <Link 
                  to={`/product/${product.id}`}
                  className="w-fit bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-white hover:text-slate-900 transition-all duration-300"
                >
                   View Details <span>→</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="flex justify-center items-center h-48">
            <p className="text-slate-400">Loading authentic crafts...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DynamicFeaturedProducts;
