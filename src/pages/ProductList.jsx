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

  async function fetchProducts() {

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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-4xl font-black font-display tracking-tight mb-2 text-zinc-900">
          Swadeshi Marketplace
        </h2>
        <p className="text-zinc-500 mb-10 text-lg">Discover authentic, verified heritage crafts directly from artisans.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {products.map(product => (

            <Link key={product.id} to={`/product/${product.id}`} className="group h-full">

              <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">

                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.artisanVerified && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-emerald-700 border border-emerald-100/50 shadow-sm text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Verified Artisan
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold font-display text-zinc-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xl font-black text-indigo-900 shrink-0 ml-4">
                      ₹{product.price}
                    </p>
                  </div>

                  <p className="text-zinc-500 text-sm mb-6 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mt-auto">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-4">
                      <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Authentic Swadeshi
                      </p>
                      <p className="text-[10px] text-emerald-600/70 font-mono truncate">
                        {product.authenticityHash}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        downloadCertificate(product);
                      }}
                      className="w-full bg-[#FCFAFA] text-zinc-700 border border-zinc-200 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-100 hover:text-indigo-600 transition-colors"
                    >
                      Download Certificate
                    </button>
                  </div>

                </div>
              </div>

            </Link>

          ))}

        </div>
      </div>
    </PageWrapper>
  );
}

export default ProductList;