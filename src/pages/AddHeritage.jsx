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

  const normalizedRole = userRole?.toLowerCase();
  if (normalizedRole !== "admin") {
    return (
      <PageWrapper className="flex justify-center items-center py-20 min-h-[70vh] bg-[#FCFAFA]">
        <h2 className="text-2xl text-red-600 font-bold font-display">Access Denied: Administrator level required.</h2>
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
        createdAt: new Date()
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
           <h2 className="text-4xl font-black font-display text-zinc-900 tracking-tight mb-2">Digital Heritage Documentation</h2>
           <p className="text-zinc-500 font-medium">Record and map cultural heritage assets using AI-assisted extraction.</p>
        </div>

        <div className="relative z-10 bg-[#FCFAFA] shadow-inner border border-zinc-100 p-6 rounded-2xl mb-10">
          <h3 className="font-bold text-zinc-900 mb-2 flex items-center gap-2 font-display text-lg">
            <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg"><FaMagic size={14} /></span> AI-Powered Data Mapping
          </h3>
          <p className="text-sm text-zinc-500 mb-4 leading-relaxed font-medium">
            Paste an unstructured folklore, historical record, or cultural story into the Description box below. Then click the AI Magic button to automatically extract and classify the data fields.
          </p>
          <button 
            type="button" 
            onClick={handleAIExtraction} 
            disabled={isAnalyzing}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 disabled:bg-indigo-300 transition-all flex items-center gap-2 shadow-sm text-sm tracking-wide"
          >
            {isAnalyzing ? "Processing NLP Analysis..." : "✨ Extract with AI"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Cultural Description (Unstructured Text)</label>
            <textarea
              className="w-full p-4 bg-[#FCFAFA] border-2 border-zinc-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-medium text-zinc-900 transition-all placeholder:text-zinc-400 h-40 resize-none shadow-sm"
              placeholder="e.g. In the arid regions of Rajasthan, artisans have practiced blue pottery since..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Title</label>
              <input
                type="text"
                placeholder="e.g. Jaipur Blue Pottery"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-4 bg-[#FCFAFA] border-2 border-zinc-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-medium text-zinc-900 transition-all placeholder:text-zinc-400 shadow-sm"
                required
              />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Category</label>
               <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-4 bg-[#FCFAFA] border-2 border-zinc-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-medium text-zinc-900 transition-all shadow-sm cursor-pointer"
               >
                  <option value="Monument">Monument</option>
                  <option value="Craft">Craft</option>
                  <option value="Festival">Festival</option>
                  <option value="Tradition">Tradition</option>
               </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Region Map</label>
              <input
                type="text"
                placeholder="e.g. Rajasthan"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full p-4 bg-[#FCFAFA] border-2 border-zinc-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-medium text-zinc-900 transition-all placeholder:text-zinc-400 shadow-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Image URL</label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-4 bg-[#FCFAFA] border-2 border-zinc-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-medium text-zinc-900 transition-all placeholder:text-zinc-400 shadow-sm"
                required
              />
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-100 mt-8">
            <button 
              type="submit"
              className="w-full bg-zinc-900 text-indigo-400 py-4 rounded-xl font-bold font-display text-lg tracking-wide hover:bg-black hover:text-indigo-300 transition-all shadow-md flex justify-center items-center"
            >
              Save to Digital Database
            </button>
          </div>

        </form>
      </div>
    </PageWrapper>
  );
}

export default AddHeritage;
