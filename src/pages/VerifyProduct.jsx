import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import PageWrapper from "../components/PageWrapper";
import { FaShieldAlt, FaCheckCircle, FaTimesCircle, FaSearch } from "react-icons/fa";

function VerifyProduct() {
  const [hash, setHash] = useState("");
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  const verifyProduct = async () => {
    if (!hash.trim()) return;
    
    setStatus("loading");
    setProduct(null);

    try {
      const q = query(
        collection(db, "products"),
        where("authenticityHash", "==", hash.trim())
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setStatus("error");
        setMessage("Product not found. This hash may be counterfeit or invalid.");
      } else {
        const doc = querySnapshot.docs[0];
        setProduct(doc.data());
        setStatus("success");
        setMessage("Authentic Swadeshi Product Verified via Ledger");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Verification failed due to a network error.");
    }
  };

  return (
    <PageWrapper className="min-h-[80vh] flex justify-center items-center py-12 px-4 bg-gray-50">
      
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        
        <div className="text-center mb-8">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
            <FaShieldAlt size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Authenticity Verification</h2>
          <p className="text-gray-500 mt-2">
            Enter the unique blockchain-style hash found on your physical product or certificate to verify its Swadeshi origins.
          </p>
        </div>

        <div className="relative mb-8">
          <input
            type="text"
            placeholder="e.g. QWp1bnUgUGF0aWthMTcxNjc4OT..."
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            className="w-full p-4 pl-5 pr-32 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 font-mono text-sm bg-gray-50 transition placeholder:font-sans"
          />
          <button 
            onClick={verifyProduct}
            disabled={status === "loading"}
            className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-6 rounded-lg font-medium hover:bg-indigo-700 transition disabled:bg-indigo-400 flex items-center gap-2"
          >
            {status === "loading" ? "Checking..." : <><FaSearch /> Verify</>}
          </button>
        </div>

        {status === "error" && (
          <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-center">
            <FaTimesCircle size={48} className="text-red-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-red-700 mb-1">Verification Failed</h3>
            <p className="text-red-600 font-medium">{message}</p>
          </div>
        )}

        {status === "success" && product && (
          <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
            <div className="text-center mb-6">
               <FaCheckCircle size={48} className="text-green-500 mx-auto mb-3" />
               <h3 className="text-xl font-bold text-green-700 mb-1">{message}</h3>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm border border-green-100">
               <div className="flex gap-4 items-center mb-4">
                 {product.imageUrl && (
                    <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                 )}
                 <div>
                    <h4 className="font-bold text-lg text-gray-800">{product.name}</h4>
                    <p className="text-green-600 font-bold">₹{product.price}</p>
                 </div>
               </div>
               
               <p className="text-sm text-gray-600 mb-4">{product.description}</p>
               
               <div className="bg-gray-50 p-3 rounded text-xs font-mono text-gray-500 break-all border border-gray-100">
                 <span className="font-bold text-gray-700 block mb-1">Verified Hash:</span>
                 {hash}
               </div>
            </div>
          </div>
        )}

      </div>

    </PageWrapper>
  );
}

export default VerifyProduct;
