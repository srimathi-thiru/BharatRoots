import React, { useState, useContext } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { analyzeCulturalText } from "../services/aiService";
import { FaMagic, FaLandmark } from "react-icons/fa";
import PageWrapper from "../components/PageWrapper";

function AddHeritage() {

  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Monument");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { userRole } = useContext(AuthContext);

  // ✅ FIXED ROLE CHECK
  const normalizedRole = userRole?.toLowerCase();
  const isAllowed = normalizedRole === "admin" || normalizedRole === "artisan";

  if (!isAllowed) {
    return (
      <PageWrapper className="flex justify-center items-center py-20 min-h-[70vh] bg-[#FCFAFA]">
        <h2 className="text-2xl text-red-600 font-bold font-display">
          Access Denied: Only Artisans & Admins can add heritage.
        </h2>
      </PageWrapper>
    );
  }

  const handleAIExtraction = async () => {
    if (!description || description.length < 10) {
      toast.error("Please paste a detailed cultural story first!");
      return;
    }
    
    setIsAnalyzing(true);
    toast("AI is analyzing text...", { icon: '🧠' });

    try {
      const result = await analyzeCulturalText(description);
      setTitle(result.title);
      setCategory(result.category);
      setRegion(result.region);
      toast.success("AI extraction complete! Form auto-filled.");
    } catch (error) {
      toast.error("AI Analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "heritage"), {
        title,
        category,
        region,
        description,
        imageUrl,
        createdAt: new Date(),

        // ✅ OPTIONAL (recommended for future)
        createdByRole: normalizedRole,
        status: normalizedRole === "admin" ? "approved" : "pending"
      });

      toast.success("Heritage added successfully ✅");

      setTitle("");
      setRegion("");
      setDescription("");
      setImageUrl("");

    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <PageWrapper className="py-12 px-4 max-w-4xl mx-auto min-h-[80vh]">
      <div className="bg-white rounded-[2rem] shadow-sm border border-zinc-200 p-8 md:p-12 relative overflow-hidden">
        
        <FaLandmark className="absolute -right-10 -top-10 text-indigo-50/50" size={250} />

        <div className="relative z-10 mb-10 border-b border-zinc-100 pb-8">
           <div className="inline-flex justify-center items-center w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-6 shadow-sm">
             <FaLandmark size={32} />
           </div>
           <h2 className="text-4xl font-black font-display text-zinc-900 tracking-tight mb-2">
             Digital Heritage Documentation
           </h2>
           <p className="text-zinc-500 font-medium">
             Record and map cultural heritage assets using AI-assisted extraction.
           </p>
        </div>

        <div className="relative z-10 bg-[#FCFAFA] shadow-inner border border-zinc-100 p-6 rounded-2xl mb-10">
          <h3 className="font-bold text-zinc-900 mb-2 flex items-center gap-2 font-display text-lg">
            <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg">
              <FaMagic size={14} />
            </span> 
            AI-Powered Data Mapping
          </h3>
          <p className="text-sm text-zinc-500 mb-4 leading-relaxed font-medium">
            Paste an unstructured folklore, historical record, or cultural story.
          </p>
          <button 
            type="button" 
            onClick={handleAIExtraction} 
            disabled={isAnalyzing}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 disabled:bg-indigo-300 transition-all flex items-center gap-2 shadow-sm text-sm"
          >
            {isAnalyzing ? "Processing..." : "✨ Extract with AI"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">

          <textarea
            className="w-full p-4 bg-[#FCFAFA] border-2 border-zinc-200 rounded-xl"
            placeholder="Cultural description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 border rounded-xl"
            required
          />

          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-4 border rounded-xl"
          >
            <option value="Monument">Monument</option>
            <option value="Craft">Craft</option>
            <option value="Festival">Festival</option>
            <option value="Tradition">Tradition</option>
          </select>

          <input
            type="text"
            placeholder="Region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full p-4 border rounded-xl"
            required
          />

          <input
            type="url"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-4 border rounded-xl"
            required
          />

          <button 
            type="submit"
            className="w-full bg-zinc-900 text-indigo-400 py-4 rounded-xl font-bold hover:bg-black"
          >
            Save to Database
          </button>

        </form>
      </div>
    </PageWrapper>
  );
}

export default AddHeritage;