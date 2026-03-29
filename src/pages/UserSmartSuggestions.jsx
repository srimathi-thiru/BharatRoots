import React from "react";
import PageWrapper from "../components/PageWrapper";
import { MdOutlineLightbulb, MdTrendingUp, MdOutlineNature, MdShoppingBag } from "react-icons/md";
import { Link } from "react-router-dom";

const UserSmartSuggestions = () => {
  return (
    <PageWrapper className="w-full bg-[#FAF7F2] min-h-[90vh] pb-24 px-4 md:px-8 py-10 overflow-hidden relative">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50/40 hidden lg:block" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}></div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        
        {/* EDITORIAL HEADER */}
        <div className="mb-14 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-200/50 border border-stone-300 mb-6 font-sans">
              <MdOutlineLightbulb className="text-stone-700" size={16} />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">Discovery Engine</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-stone-900 font-display">
              Curated <span className="text-orange-600 italic">For You.</span>
            </h1>
            <p className="mt-6 text-lg text-stone-600 leading-relaxed max-w-xl">
              Based on your browsing history and global trends, uncover authentic handmade crafts and heritage experiences matching your cultural interests.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-5 min-w-[200px]">
             <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0 border border-orange-100">
                <MdOutlineLightbulb size={28} />
             </div>
             <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1 mt-1 font-sans">Fresh Drops</p>
                <p className="text-2xl font-bold text-stone-800">12 <span className="text-sm font-medium text-stone-400">new items</span></p>
             </div>
          </div>
        </div>

        {/* TRENDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Suggestion 1 */}
            <div className="bg-white border border-stone-200 p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow group relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
               <div className="relative z-10">
                 <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-amber-200">
                    <MdTrendingUp size={24} />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2 font-sans">Upcoming Festival</p>
                 <h3 className="text-2xl font-display font-bold text-stone-900 mb-4">Banarasi Silks</h3>
                 <p className="text-stone-500 text-sm leading-relaxed mb-8">
                   Prepare for the festive season with authentic handloom sarees directly from master weavers. Demand is rising by 45%.
                 </p>
                 <Link to="/search" className="text-amber-700 font-bold text-sm tracking-widest uppercase hover:text-amber-500 transition-colors flex items-center gap-2">
                   Explore Collection &rarr;
                 </Link>
               </div>
            </div>

            {/* Suggestion 2 */}
            <div className="bg-white border border-stone-200 p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow group relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
               <div className="relative z-10">
                 <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-green-200">
                    <MdOutlineNature size={24} />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-2 font-sans">Eco-Conscious</p>
                 <h3 className="text-2xl font-display font-bold text-stone-900 mb-4">Natural Dye Textiles</h3>
                 <p className="text-stone-500 text-sm leading-relaxed mb-8">
                   Discover textiles made exclusively using plant-based organic dyes, a sustainable choice supporting traditional craft methods.
                 </p>
                 <Link to="/products" className="text-green-700 font-bold text-sm tracking-widest uppercase hover:text-green-500 transition-colors flex items-center gap-2">
                   Shop Sustainable &rarr;
                 </Link>
               </div>
            </div>

            {/* Suggestion 3 */}
            <div className="bg-white border border-stone-200 p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow group relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-stone-100 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
               <div className="relative z-10">
                 <div className="w-12 h-12 bg-stone-100 text-stone-600 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-stone-200">
                    <MdShoppingBag size={24} />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-stone-600 mb-2 font-sans">Artisan Spotlight</p>
                 <h3 className="text-2xl font-display font-bold text-stone-900 mb-4">Terracotta Masters</h3>
                 <p className="text-stone-500 text-sm leading-relaxed mb-8">
                   Since you recently viewed clay pottery, we suggest exploring this limited batch of authentic Kulhads and drinkware.
                 </p>
                 <Link to="/products" className="text-stone-700 font-bold text-sm tracking-widest uppercase hover:text-stone-500 transition-colors flex items-center gap-2">
                   View Catalog &rarr;
                 </Link>
               </div>
            </div>

        </div>

      </div>
    </PageWrapper>
  );
};

export default UserSmartSuggestions;
