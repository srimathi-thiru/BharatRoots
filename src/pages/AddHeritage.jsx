import React, { useState, useContext } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { analyzeCulturalText } from "../services/aiService";
import { FaMagic } from "react-icons/fa";

function AddHeritage() {

  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Monument");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { userRole } = useContext(AuthContext);

  if (userRole !== "ADMIN" && userRole !== "admin") {
    return (
      <div className="flex justify-center items-center py-20">
        <h2 className="text-2xl text-red-600 font-bold">Access Denied: Administrator level required.</h2>
      </div>
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
    <div className="max-w-3xl mx-auto my-10 p-8 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Digital Heritage Documentation</h2>

      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg mb-8">
        <h3 className="font-semibold text-indigo-800 mb-2 flex items-center gap-2">
          <FaMagic /> AI-Powered Data Mapping
        </h3>
        <p className="text-sm text-indigo-600 mb-3">
          Paste an unstructured folklore, historical record, or cultural story into the Description box below. Then click the AI Magic button to automatically extract and classify the data fields.
        </p>
        <button 
          type="button" 
          onClick={handleAIExtraction} 
          disabled={isAnalyzing}
          className="bg-indigo-600 text-white px-4 py-2 rounded font-medium hover:bg-indigo-700 disabled:bg-indigo-300 transition flex items-center gap-2"
        >
          {isAnalyzing ? "Processing NLP..." : "✨ Extract with AI"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cultural Description (Unstructured Text)</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 h-32"
            placeholder="e.g. In the arid regions of Rajasthan, artisans have practiced blue pottery since..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              placeholder="e.g. Jaipur Blue Pottery"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
             <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
             >
                <option value="Monument">Monument</option>
                <option value="Craft">Craft</option>
                <option value="Festival">Festival</option>
                <option value="Tradition">Tradition</option>
             </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Region Map</label>
            <input
              type="text"
              placeholder="e.g. Rajasthan"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
        >
          Save to Digital Database
        </button>

      </form>
    </div>
  );
}

export default AddHeritage;
