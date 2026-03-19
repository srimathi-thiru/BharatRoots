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
    <PageWrapper className="min-h-screen p-8 bg-amber-50">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">

        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-80 object-cover rounded-lg mb-6"
        />

        <h1 className="text-3xl font-bold text-orange-800 mb-2">
          {product.name}
        </h1>

        <p className="text-xl text-green-700 mb-4">
          ₹{product.price}
        </p>

        <p className="text-gray-700 mb-6">
          {product.description}
        </p>

        <button
          onClick={handleAddToCart}
          className="bg-orange-600 text-white px-6 py-3 rounded mt-4 hover:bg-orange-700 transition font-bold"
        >
          Add to Cart
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          
          {/* Artisan Card */}
          {artisan && (
            <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl">
              <h2 className="text-xl font-bold mb-3 text-gray-800">
                Crafted By
              </h2>
              <div className="space-y-2">
                <p className="text-gray-700"><b className="text-gray-900">Name:</b> {artisan.name}</p>
                <p className="text-gray-700"><b className="text-gray-900">Region:</b> {artisan.region}</p>
                <p className="text-gray-700"><b className="text-gray-900">Specialty:</b> {artisan.specialization}</p>
              </div>
            </div>
          )}

          {/* Authenticity Badge */}
          <div className="bg-green-50 border border-green-200 p-5 rounded-xl flex flex-col justify-center relative overflow-hidden">
             {/* Decorative background shield */}
             <FaShieldAlt className="absolute -right-4 -bottom-4 text-green-100/50" size={120} />
             
             <div className="relative z-10">
                <h2 className="text-xl font-bold mb-2 text-green-800 flex items-center gap-2">
                  <FaShieldAlt /> 100% Authentic Swadeshi
                </h2>
                <p className="text-sm text-green-700 mb-3">
                  This product's origin is cryptographically verified on our digital ledger.
                </p>
                <div className="bg-white p-2 rounded text-xs font-mono text-gray-500 break-all border border-green-100 mb-3">
                  {product.authenticityHash}
                </div>
                
                <button 
                  onClick={() => navigate('/verify')}
                  className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
                >
                  Verify Hash <FaExternalLinkAlt size={10} />
                </button>
             </div>
          </div>

        </div>

      </div>
    </PageWrapper>
  );
}

export default ProductDetail;