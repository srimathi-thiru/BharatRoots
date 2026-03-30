import React, { useState, useContext } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import PageWrapper from "../components/PageWrapper";
import { MdHealthAndSafety, MdImage } from "react-icons/md";

function AddRemedy() {
  const { currentUser } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "", category: "", ingredients: "",
    preparation: "", usage: "", benefits: "",
    precautions: "", imageUrl: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "remedies"), {
        ...formData,
        ingredients: formData.ingredients.split(",").map((i) => i.trim()),
        addedBy: currentUser.uid,
        createdAt: new Date(),
      });
      toast.success("Remedy added successfully ✅");
      setFormData({ title: "", category: "", ingredients: "", preparation: "", usage: "", benefits: "", precautions: "", imageUrl: "" });
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

        <MdHealthAndSafety className="absolute -right-10 -top-10 text-amber-50/50" size={250} />

        <div className="relative z-10 mb-10 border-b border-zinc-100 pb-8">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 mb-6 shadow-sm">
            <MdHealthAndSafety size={32} />
          </div>
          <h2 className="text-4xl font-black font-display text-zinc-900 tracking-tight mb-2">Add Ayurvedic Remedy</h2>
          <p className="text-zinc-500 font-medium">Contribute traditional Indian wellness knowledge to the BharatRoots archive.</p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">

          {/* Title + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Remedy Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Adrak-Tulsi Elixir"
                value={formData.title}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Category</label>
              <input
                type="text"
                name="category"
                placeholder="e.g. Cold, Digestion, Skin Care"
                value={formData.category}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-2">
            <label className={labelClass}>
              Ingredients <span className="normal-case font-normal text-zinc-400">(comma separated)</span>
            </label>
            <textarea
              name="ingredients"
              placeholder="e.g. Tulsi, Ginger, Honey, Turmeric"
              value={formData.ingredients}
              onChange={handleChange}
              required
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Preparation */}
          <div className="space-y-2">
            <label className={labelClass}>Preparation Steps</label>
            <textarea
              name="preparation"
              placeholder="Describe how to prepare this remedy..."
              value={formData.preparation}
              onChange={handleChange}
              required
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Usage + Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>How to Use</label>
              <textarea
                name="usage"
                placeholder="Dosage and usage instructions..."
                value={formData.usage}
                onChange={handleChange}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Benefits</label>
              <textarea
                name="benefits"
                placeholder="Key health benefits..."
                value={formData.benefits}
                onChange={handleChange}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          {/* Precautions */}
          <div className="space-y-2">
            <label className={labelClass}>Precautions / Side Effects</label>
            <textarea
              name="precautions"
              placeholder="Any warnings or contraindications..."
              value={formData.precautions}
              onChange={handleChange}
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label className={labelClass}>Image URL</label>
            <div className="relative">
              <MdImage className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
              <input
                type="url"
                name="imageUrl"
                placeholder="https://example.com/remedy-image.jpg"
                value={formData.imageUrl}
                onChange={handleChange}
                className={`${inputClass} pl-12`}
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-zinc-900 text-amber-500 py-4 rounded-xl font-bold font-display text-lg tracking-wide hover:bg-black transition-all disabled:opacity-70 shadow-md flex justify-center items-center"
            >
              {isSubmitting ? "Saving to Archive..." : "Publish Remedy"}
            </button>
          </div>

        </form>
      </div>
    </PageWrapper>
  );
}

export default AddRemedy;
