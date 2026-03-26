import React, { useState } from "react";
import PageWrapper from "../components/PageWrapper";

const AddRemedy = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    ingredients: "",
    preparation: "",
    usage: "",
    benefits: "",
    precautions: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Remedy Submitted:", formData);

    // TODO: Connect to Firebase / backend
    alert("Remedy added successfully!");
    
    setFormData({
      title: "",
      category: "",
      ingredients: "",
      preparation: "",
      usage: "",
      benefits: "",
      precautions: "",
      imageUrl: "",
    });
  };

  return (
    <PageWrapper className="py-10 px-4 max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow border border-zinc-200">

        {/* Header */}
        <h1 className="text-3xl font-bold mb-6 text-zinc-900">
          Add New Remedy 🌿
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Remedy Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />

          {/* Category */}
          <input
            type="text"
            name="category"
            placeholder="Category (e.g. Skin Care, Cold, Hair Care)"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />

          {/* Ingredients */}
          <textarea
            name="ingredients"
            placeholder="Ingredients (comma separated)"
            value={formData.ingredients}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            rows={3}
            required
          />

          {/* Preparation */}
          <textarea
            name="preparation"
            placeholder="Preparation Steps"
            value={formData.preparation}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            rows={3}
            required
          />

          {/* Usage */}
          <textarea
            name="usage"
            placeholder="How to Use"
            value={formData.usage}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            rows={2}
          />

          {/* Benefits */}
          <textarea
            name="benefits"
            placeholder="Benefits"
            value={formData.benefits}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            rows={2}
          />

          {/* Precautions */}
          <textarea
            name="precautions"
            placeholder="Precautions / Side Effects"
            value={formData.precautions}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            rows={2}
          />

          {/* Image URL */}
          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Add Remedy
          </button>

        </form>
      </div>
    </PageWrapper>
  );
};

export default AddRemedy;