import React, { useState, useContext, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import PageWrapper from "../components/PageWrapper";
import { MdAddBusiness, MdImage } from "react-icons/md";
import { useLocation } from "react-router-dom";

function AddProduct() {
  const { currentUser, userRole } = useContext(AuthContext);
  const location = useLocation();
  const aiDraft = location.state?.aiDraft;

  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hydrate fields if coming from Creator Studio AI generator
  useEffect(() => {
    if (aiDraft) {
      setName(aiDraft.title || "");
      setDescription(aiDraft.description || "");
      // You can also add a success pulse effect or visually indicate AI assistance if desired
    }
  }, [aiDraft]);

  const normalizedRole = userRole?.toLowerCase();
  if (normalizedRole !== "artisan" && normalizedRole !== "admin") {
    return (
      <div className="flex justify-center items-center py-20 min-h-screen bg-[#FCFAFA]">
        <h2 className="text-2xl text-red-600 font-bold font-display">Access Denied: Artisan or Admin account required.</h2>
      </div>
    );
  }

  const generateHash = (data) => {
    return btoa(data + Date.now());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const hash = generateHash(name + description + price);

      await addDoc(collection(db, "products"), {
        artisanId: currentUser.uid,
        name,
        description,
        price,
        imageUrl,
        authenticityHash: hash,
        createdAt: new Date()
      });

      toast.success("Product added successfully ✅");
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper className="py-12 px-4 max-w-4xl mx-auto min-h-[80vh]">
      
      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-zinc-200 relative overflow-hidden">
        
        <MdAddBusiness className="absolute -right-10 -top-10 text-amber-50/50" size={250} />

        <div className="relative z-10 mb-10 border-b border-zinc-100 pb-8">
           <div className="inline-flex justify-center items-center w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 mb-6 shadow-sm">
             <MdAddBusiness size={32} />
           </div>
           <h2 className="text-4xl font-black font-display text-zinc-900 tracking-tight mb-2">Add Swadeshi Product</h2>
           <p className="text-zinc-500 font-medium">List a new handcrafted artifact to the digital marketplace. It will be secured with a cryptographic ledger hash.</p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Product Name</label>
              <input
                type="text"
                placeholder="e.g. Handwoven Silk Saree"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-4 bg-[#FCFAFA] border-2 border-zinc-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 font-medium text-zinc-900 transition-all placeholder:text-zinc-400"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Price (₹)</label>
              <input
                type="number"
                placeholder="e.g. 4500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full p-4 bg-[#FCFAFA] border-2 border-zinc-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 font-medium text-zinc-900 transition-all placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Product Description</label>
            <textarea
              placeholder="Describe the craftsmanship, materials used, and historical significance..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full p-4 bg-[#FCFAFA] border-2 border-zinc-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 font-medium text-zinc-900 transition-all placeholder:text-zinc-400 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Image URL</label>
            <div className="relative">
              <MdImage className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                className="w-full p-4 pl-12 bg-[#FCFAFA] border-2 border-zinc-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 font-medium text-zinc-900 transition-all placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-zinc-900 text-amber-500 py-4 rounded-xl font-bold font-display text-lg tracking-wide hover:bg-black transition-all disabled:opacity-70 shadow-md flex justify-center items-center"
            >
              {isSubmitting ? "Generating Ledger Hash..." : "Publish Artifact"}
            </button>
          </div>

        </form>

      </div>
    </PageWrapper>
  );
}

export default AddProduct;
