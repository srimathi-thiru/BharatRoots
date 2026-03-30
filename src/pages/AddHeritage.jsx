import React, { useState, useContext } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { analyzeCulturalText } from "../services/aiService";
import { FaLandmark } from "react-icons/fa";
import { MdImage, MdAutoAwesome } from "react-icons/md";
import PageWrapper from "../components/PageWrapper";

function AddHeritage() {
  const { userRole } = useContext(AuthContext);
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Monument");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizedRole = userRole?.toLowerCase();
  const isAllowed = normalizedRole === "admin" || normalizedRole === "artisan";

  if (!isAllowed) {
    return (
      <div className="flex justify-center items-center py-20 min-h-screen bg-[#FCFAFA]">
        <h2 className="text-2xl text-red-600 font-bold font-display">
          Access Denied: Artisan or Admin account required.
        </h2>
      </div>
    );
  }

  const handleAIExtraction = async () => {
    if (!description || description.length < 10) {
      toast.error("Please write a cultural description first!");
      return;
    }
    setIsAnalyzing(true);
    toast("AI is analyzing your text...", { icon: "🧠" });
    try {
      const result = await analyzeCulturalText(description);
      setTitle(result.title);
      setCategory(result.category);
      setRegion(result.region);
      toast.success("AI extraction complete! Fields auto-filled.");
    } catch {
      toast.error("AI Analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "heritage"), {
        title,
        category,
        region,
        description,
        imageUrl,
        createdAt: new Date(),
        createdByRole: normalizedRole,
        status: normalizedRole === "admin" ? "approved" : "pending",
      });
      toast.success(
        normalizedRole === "admin"
          ? "Heritage added successfully ✅"
          : "Heritage submitted! Pending admin review. ⏳"
      );
      setTitle(""); setRegion(""); setDescription(""); setImageUrl("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full p-4 bg-[#FCFAFA] border-2 border-zinc-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 font-medium text-zinc-900 transition-all placeholder:text-zinc-400";
  const labelClass = "text-xs font-bold text-zinc-400 uppercase tracking-widest";

  return (
    <PageWrapper className="py-12 px-4 max-w-4xl mx-auto min-h-[80vh]">
      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-zinc-200 relative overflow-hidden">

        <FaLandmark className="absolute -right-10 -top-10 text-amber-50/50" size={250} />

        <div className="relative z-10 mb-10 border-b border-zinc-100 pb-8">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 mb-6 shadow-sm">
            <FaLandmark size={32} />
          </div>
          <h2 className="text-4xl font-black font-display text-zinc-900 tracking-tight mb-2">Add Heritage Site</h2>
          <p className="text-zinc-500 font-medium">Document a cultural heritage asset. Use AI to auto-extract details from a cultural story.</p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">

          {/* Description + AI */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={labelClass}>Cultural Description</label>
              <button
                type="button"
                onClick={handleAIExtraction}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-all disabled:opacity-50"
              >
                <MdAutoAwesome size={14} />
                {isAnalyzing ? "Analyzing..." : "Auto-fill with AI"}
              </button>
            </div>
            <textarea
              placeholder="Paste a cultural story, folklore, or historical record — AI will extract the title, region, and category automatically..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Title + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Heritage Title</label>
              <input
                type="text"
                placeholder="e.g. Hampi Ruins"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
              >
                <option value="Monument">Monument</option>
                <option value="Craft">Craft</option>
                <option value="Festival">Festival</option>
                <option value="Tradition">Tradition</option>
              </select>
            </div>
          </div>

          {/* Region */}
          <div className="space-y-2">
            <label className={labelClass}>Region / State</label>
            <input
              type="text"
              placeholder="e.g. Karnataka, South India"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label className={labelClass}>Image URL</label>
            <div className="relative">
              <MdImage className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
              <input
                type="url"
                placeholder="https://example.com/heritage-image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                className={`${inputClass} pl-12`}
              />
            </div>
          </div>

          {/* Artisan pending notice */}
          {normalizedRole === "artisan" && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-amber-500 text-lg mt-0.5">⏳</span>
              <p className="text-sm text-amber-800 font-medium">
                Your submission will be reviewed by an admin before it appears publicly on the platform.
              </p>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-zinc-900 text-amber-500 py-4 rounded-xl font-bold font-display text-lg tracking-wide hover:bg-black transition-all disabled:opacity-70 shadow-md flex justify-center items-center"
            >
              {isSubmitting ? "Saving to Archive..." : "Publish Heritage"}
            </button>
          </div>

        </form>
      </div>
    </PageWrapper>
  );
}

export default AddHeritage;
