import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";

function ProductList() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {

    const querySnapshot = await getDocs(collection(db, "products"));

    const data = await Promise.all(
      querySnapshot.docs.map(async (docItem) => {

        const product = {
          id: docItem.id,
          ...docItem.data()
        };

        // Fetch artisan verification status
        if (product.artisanId) {

          const artisanRef = doc(db, "artisans", product.artisanId);
          const artisanSnap = await getDoc(artisanRef);

          if (artisanSnap.exists()) {
            product.artisanVerified = artisanSnap.data().verified;
          }
        }

        return product;
      })
    );

    setProducts(data);
  };


  // Download Certificate Function
  const downloadCertificate = (product) => {

    const docPDF = new jsPDF();

    docPDF.setFontSize(18);
    docPDF.text("BHARATROOTS AUTHENTICITY CERTIFICATE", 20, 20);

    docPDF.setFontSize(12);
    docPDF.text(`Product Name: ${product.name}`, 20, 40);
    docPDF.text(`Description: ${product.description}`, 20, 50);
    docPDF.text(`Price: ₹${product.price}`, 20, 60);

    docPDF.text(
      `Verified Artisan: ${product.artisanVerified ? "YES" : "NO"}`,
      20,
      70
    );

    docPDF.text("Authenticity Hash:", 20, 90);

    docPDF.setFontSize(10);
    docPDF.text(product.authenticityHash, 20, 100, {
      maxWidth: 170
    });

    docPDF.setFontSize(12);
    docPDF.text("Certified by BharatRoots", 20, 130);

    docPDF.save(`${product.name}_certificate.pdf`);
  };


  return (

    <div>

      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Swadeshi Marketplace
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {products.map(product => (

          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >

            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-3"
            />

            {/* Product Name */}
            <Link to={`/artisan/${product.artisanId}`}>
              <h3 className="text-xl font-semibold text-blue-600 mb-2 hover:underline">
                {product.name}
              </h3>
            </Link>

            {/* VERIFIED BADGE */}
            {product.artisanVerified && (
              <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full mb-2">
                ✔ Verified Artisan
              </span>
            )}

            {/* Description */}
            <p className="text-gray-600 mb-2">
              {product.description}
            </p>

            {/* Price */}
            <p className="text-lg font-bold text-green-600 mb-2">
              ₹{product.price}
            </p>

            {/* Authentic Badge */}
            <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
              Authentic Swadeshi Certified
            </span>

            {/* Hash */}
            <p className="text-xs text-gray-400 mt-2 break-all">
              Code: {product.authenticityHash}
            </p>

            {/* DOWNLOAD CERTIFICATE BUTTON */}
            <button
              onClick={() => downloadCertificate(product)}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Download Certificate
            </button>

          </div>

        ))}

      </div>

    </div>

  );
}

export default ProductList;
