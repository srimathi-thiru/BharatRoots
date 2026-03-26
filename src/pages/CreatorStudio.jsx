import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Sparkles, Brain, Globe, Trophy } from "lucide-react";

const CreatorStudio = () => {
  const { userName } = useContext(AuthContext);

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold">Welcome back, {userName || "Artisan"} 👋</h1>
        <p className="opacity-90">Your AI-powered creative companion</p>
      </div>

      {/* Creative Focus */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="font-semibold text-gray-700 mb-3">🎯 Today’s Creative Focus</h2>
        <ul className="space-y-2 text-gray-600">
          <li>• Continue your last product</li>
          <li>• Add cultural story to improve reach</li>
          <li>• Your craft is trending in Chennai 🔥</li>
        </ul>
      </div>

      {/* AI Co-Creator */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="flex items-center gap-2 font-semibold text-gray-700 mb-3">
          <Brain className="text-indigo-500" /> AI Co-Creator
        </h2>
        <div className="space-y-2 text-gray-600">
          <p>• Suggested Price Range: ₹1200 – ₹1500</p>
          <p>• Style: Traditional & Earthy</p>
          <p>• Add tags: Handmade, Eco-friendly</p>
        </div>
        <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          ✨ Enhance My Product
        </button>
      </div>

      {/* Progress */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="flex items-center gap-2 font-semibold text-gray-700 mb-3">
          <Trophy className="text-yellow-500" /> Creator Progress
        </h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm">Profile Completion</p>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div className="bg-indigo-500 h-2 rounded-full w-3/4"></div>
            </div>
          </div>
          <div>
            <p className="text-sm">Products Added</p>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div className="bg-green-500 h-2 rounded-full w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Impact */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="flex items-center gap-2 font-semibold text-gray-700 mb-3">
          <Globe className="text-blue-500" /> Your Craft in the World
        </h2>
        <p className="text-gray-600">Seen in 6 states • Popular in Bangalore & Delhi</p>
      </div>

      {/* Creative Challenges */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="flex items-center gap-2 font-semibold text-gray-700 mb-3">
          <Sparkles className="text-purple-500" /> Creative Challenges
        </h2>
        <ul className="space-y-2 text-gray-600">
          <li>• Add an eco-friendly product 🌱</li>
          <li>• Document a forgotten tradition 📜</li>
        </ul>
      </div>

    </div>
  );
};

export default CreatorStudio;
