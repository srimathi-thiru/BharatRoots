import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import PageWrapper from "../components/PageWrapper";
import { FaShieldAlt, FaExternalLinkAlt } from "react-icons/fa";

function ProductDetail() {

  const { id } = useParams();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const currentUser = authContext?.currentUser;
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {

      // 🔹 Fetch Product
      const productRef = doc(db, "products", id);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        const productData = productSnap.data();
        setProduct(productData);

        // 🔹 Fetch Artisan using userId match
        const artisanQuery = query(
          collection(db, "artisans"),
          where("userId", "==", productData.artisanId)
        );

        const artisanSnapshot = await getDocs(artisanQuery);

        if (!artisanSnapshot.empty) {
          setArtisan(artisanSnapshot.docs[0].data());
        }
      }

    } catch (error) {
      console.error("Error fetching product:", error);
    }

    setLoading(false);
  };

  // 🔹 ADD TO CART FUNCTION
  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ id, ...product });
  };

  if (loading) return <h2 className="text-center mt-10">Loading...</h2>;
  if (!product) return <h2 className="text-center mt-10">Product Not Found</h2>;

  return (
    <PageWrapper className="p-4 md:p-8 bg-[#FCFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-[2rem] shadow-sm border border-zinc-200 overflow-hidden">
        
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* Left: Image Box */}
          <div className="relative h-[400px] lg:h-auto bg-zinc-100">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>

          {/* Right: Content Details */}
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            
            <div className="mb-2">
              <span className="inline-block bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                Handcrafted
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black font-display text-zinc-900 mb-4 tracking-tight leading-tight">
              {product.name}
            </h1>

            <p className="text-3xl font-bold text-indigo-600 mb-8">
              ₹{product.price}
            </p>

            <p className="text-zinc-600 text-lg leading-relaxed mb-10">
              {product.description}
            </p>

            <button
              onClick={handleAddToCart}
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl hover:bg-indigo-700 transition-all font-bold text-lg w-full shadow-md shadow-indigo-200 flex items-center justify-center gap-3 group"
            >
              Add to Cart
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
              
              {/* Artisan Card */}
              {artisan && (
                <div className="bg-[#FCFAFA] border border-zinc-200 p-5 rounded-2xl transition-all hover:shadow-sm">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">
                    Crafted By
                  </h2>
                  <div className="space-y-3">
                    <p className="text-sm text-zinc-600 flex justify-between border-b border-zinc-100 pb-2"><b className="text-zinc-900">Name</b> <span>{artisan.name}</span></p>
                    <p className="text-sm text-zinc-600 flex justify-between border-b border-zinc-100 pb-2"><b className="text-zinc-900">Region</b> <span>{artisan.region}</span></p>
                    <p className="text-sm text-zinc-600 flex justify-between"><b className="text-zinc-900">Specialty</b> <span>{artisan.specialization}</span></p>
                  </div>
                </div>
              )}

              {/* Authenticity Badge */}
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex flex-col relative overflow-hidden transition-all hover:shadow-sm">
                 <FaShieldAlt className="absolute -right-6 -bottom-6 text-emerald-100/50" size={140} />
                 
                 <div className="relative z-10 flex flex-col h-full">
                    <h2 className="text-sm font-bold mb-3 text-emerald-800 flex items-center gap-2">
                      <FaShieldAlt /> Authentic Swadeshi
                    </h2>
                    <p className="text-xs text-emerald-700 mb-4 leading-relaxed">
                      Origin cryptographically verified on ledger.
                    </p>
                    
                    <div className="mt-auto">
                      <div className="bg-white/80 p-2.5 rounded-lg text-[10px] font-mono text-emerald-900 break-all border border-emerald-100 mb-3 shadow-inner">
                        {product.authenticityHash}
                      </div>
                      
                      <button 
                        onClick={() => navigate('/verify')}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 transition-colors uppercase tracking-widest bg-emerald-100/50 hover:bg-emerald-200 py-2 px-3 rounded-lg w-max"
                      >
                        Verify Hash <FaExternalLinkAlt size={10} />
                      </button>
                    </div>
                 </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </PageWrapper>
  );
}

export default ProductDetail;