import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import PageWrapper from "../components/PageWrapper";

function ProductDetail() {

  const { id } = useParams();
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
          className="bg-orange-600 text-white px-6 py-3 rounded mt-4 hover:bg-orange-700 transition"
        >
          Add to Cart
        </button>

        {artisan && (
          <div className="bg-gray-100 p-4 rounded-lg mt-6">

            <h2 className="text-xl font-semibold mb-2">
              Crafted By
            </h2>

            <p><b>Name:</b> {artisan.name}</p>
            <p><b>Region:</b> {artisan.region}</p>
            <p><b>Specialization:</b> {artisan.specialization}</p>

          </div>
        )}

      </div>
    </PageWrapper>
  );
}

export default ProductDetail;