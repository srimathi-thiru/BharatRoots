import React from "react";
import { Star, Eye, Heart } from "lucide-react";

const Showcase = () => {
  const products = [
    {
      id: 1,
      title: "Terracotta Vase",
      image: "https://via.placeholder.com/150",
      tag: "Signature",
    },
    {
      id: 2,
      title: "Handloom Saree",
      image: "https://via.placeholder.com/150",
      tag: "Popular",
    },
    {
      id: 3,
      title: "Wooden Carving",
      image: "https://via.placeholder.com/150",
      tag: "Rare",
    },
  ];

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold">My Showcase 🎨</h1>
        <p className="opacity-90">Highlight your best creations</p>
      </div>

      {/* Featured Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="flex items-center gap-2 font-semibold text-gray-700 mb-4">
          <Star className="text-yellow-500" /> Signature Creations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="rounded-xl border p-4 hover:shadow-md transition">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />

              <h3 className="font-semibold text-gray-800">{product.title}</h3>

              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded">
                {product.tag}
              </span>

              <div className="flex justify-between items-center mt-3 text-gray-500 text-sm">
                <span className="flex items-center gap-1">
                  <Eye size={14} /> 120
                </span>
                <span className="flex items-center gap-1">
                  <Heart size={14} /> 45
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Highlight Message */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="font-semibold text-gray-700 mb-3">✨ Showcase Insight</h2>
        <p className="text-gray-600">
          Your terracotta works are gaining more attention. Highlight eco-friendly
          products to increase engagement.
        </p>
      </div>

    </div>
  );
};

export default Showcase;
