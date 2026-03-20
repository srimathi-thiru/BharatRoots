import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import PageWrapper from "../components/PageWrapper";
import { FaShieldAlt, FaCheckCircle, FaTimesCircle, FaSearch } from "react-icons/fa";

function VerifyProduct() {
  const [hash, setHash] = useState("");
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("idle");
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
    <PageWrapper className="min-h-[80vh] flex justify-center items-center py-12 px-4 bg-[#FCFAFA]">
      
      <div className="max-w-xl w-full bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-zinc-200 relative overflow-hidden">
        
        <FaShieldAlt className="absolute -right-8 -top-8 text-indigo-50/50" size={200} />

        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex justify-center items-center w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-6 shadow-sm">
            <FaShieldAlt size={36} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-display text-zinc-900 tracking-tight">Authenticity Verification</h2>
          <p className="text-zinc-500 mt-4 leading-relaxed font-medium">
            Enter the unique cryptographic hash found on your physical product or certificate to verify its Swadeshi origins.
          </p>
        </div>

        <div className="relative mb-10 z-10">
          <input
            type="text"
            placeholder="e.g. QWp1bnUgUGF0aWthMTcxNjc4OT..."
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            className="w-full p-4 pl-6 pr-36 border-2 border-zinc-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-mono text-sm bg-[#FCFAFA] transition-all placeholder:font-sans placeholder:text-zinc-400 font-bold text-zinc-900 shadow-inner"
          />
          <button 
            onClick={verifyProduct}
            disabled={status === "loading"}
            className="absolute right-2 top-2 bottom-2 bg-zinc-900 text-amber-500 px-6 rounded-xl font-bold hover:bg-black transition-all disabled:bg-zinc-300 disabled:text-zinc-500 flex items-center gap-2 shadow-sm"
          >
            {status === "loading" ? "Checking..." : <><FaSearch /> Verify</>}
          </button>
        </div>

        {status === "error" && (
          <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center relative z-10 animate-in fade-in slide-in-from-bottom-4">
            <FaTimesCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-700 mb-2">Verification Failed</h3>
            <p className="text-red-600 font-medium">{message}</p>
          </div>
        )}

        {status === "success" && product && (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl relative z-10 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center mb-6">
               <FaCheckCircle size={56} className="text-emerald-500 mx-auto mb-4" />
               <h3 className="text-xl font-black text-emerald-800 mb-2 font-display">{message}</h3>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-emerald-100">
               <div className="flex gap-4 items-center mb-4 pb-4 border-b border-zinc-100">
                 {product.imageUrl && (
                    <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-lg shadow-sm" />
                 )}
                 <div>
                    <h4 className="font-bold text-lg text-zinc-900 font-display mb-1">{product.name}</h4>
                    <p className="text-indigo-600 font-black text-lg">₹{product.price}</p>
                 </div>
               </div>
               
               <p className="text-sm text-zinc-600 mb-5 leading-relaxed">{product.description}</p>
               
               <div className="bg-[#FCFAFA] p-4 rounded-lg text-xs font-mono text-zinc-500 break-all border border-zinc-200 shadow-inner">
                 <span className="font-bold text-zinc-800 uppercase tracking-widest text-[10px] block mb-2">Verified Ledger Hash</span>
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
