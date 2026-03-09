import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

function ProductList() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {

    try {

      const querySnapshot = await getDocs(collection(db, "products"));

      const data = await Promise.all(
        querySnapshot.docs.map(async (docItem) => {

          const product = {
            id: docItem.id,
            ...docItem.data()
          };

          // 🔹 Fetch artisan verification using userId match
          if (product.artisanId) {

            const artisanQuery = query(
              collection(db, "artisans"),
              where("userId", "==", product.artisanId)
            );

            const artisanSnapshot = await getDocs(artisanQuery);

            if (!artisanSnapshot.empty) {
              product.artisanVerified =
                artisanSnapshot.docs[0].data().verified;
            }

          }

          return product;
        })
      );

      setProducts(data);

    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // 📄 Download Certificate
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
    <PageWrapper>

      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Swadeshi Marketplace
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {products.map(product => (

          <Link key={product.id} to={`/product/${product.id}`}>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">

              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />

              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                {product.name}
              </h3>

              {product.artisanVerified && (
                <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full mb-2">
                  ✔ Verified Artisan
                </span>
              )}

              <p className="text-gray-600 mb-2">
                {product.description}
              </p>

              <p className="text-lg font-bold text-green-600 mb-2">
                ₹{product.price}
              </p>

              <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                Authentic Swadeshi Certified
              </span>

              <p className="text-xs text-gray-400 mt-2 break-all">
                Code: {product.authenticityHash}
              </p>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  downloadCertificate(product);
                }}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Download Certificate
              </button>

            </div>

          </Link>

        ))}

      </div>
    </PageWrapper>
  );
}

export default ProductList;