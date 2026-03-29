import React from "react";
import PageWrapper from "../components/PageWrapper";
import { MdOutlineLightbulb, MdTrendingUp, MdOutlineNature, MdOutlineHandyman } from "react-icons/md";

const SmartSuggestions = () => {
  return (
    <PageWrapper className="w-full bg-[#FAF7F2] min-h-[90vh] pb-24 px-4 md:px-8 py-10 overflow-hidden relative">
      
      {/* BACKGROUND ELEMENTS (Warm, earthy) */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/40 hidden lg:block" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}></div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        
        {/* EDITORIAL HEADER */}
        <div className="mb-14 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-200/50 border border-stone-300 mb-6 font-sans">
              <MdOutlineLightbulb className="text-stone-700" size={16} />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">Craft Intelligence</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-stone-900 font-display">
              Market <span className="text-emerald-600 italic">Opportunities.</span>
            </h1>
            <p className="mt-6 text-lg text-stone-600 leading-relaxed max-w-xl">
              Understand what the global community is actually searching for. Tailor your manual work to meet authentic cultural demands.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-5 min-w-[200px]">
             <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
                <MdTrendingUp size={28} />
             </div>
             <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1 mt-1 font-sans">Actionable Trends</p>
                <p className="text-2xl font-bold text-stone-800">3 <span className="text-sm font-medium text-stone-400">new</span></p>
             </div>
          </div>
        </div>

        {/* TRENDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Trend 1 */}
            <div className="bg-white border border-stone-200 p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow group relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
               <div className="relative z-10">
                 <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-amber-200">
                    <MdTrendingUp size={24} />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2 font-sans">High Demand</p>
                 <h3 className="text-2xl font-display font-bold text-stone-900 mb-4">Festive Silk Weaves</h3>
                 <p className="text-stone-500 text-sm leading-relaxed mb-8">
                   Search volume for traditional Kanjeevaram and Banarasi handloom sarees has surged by 45% ahead of the upcoming festival season. Consider expanding your textile offerings.
                 </p>
                 <button className="text-amber-700 font-bold text-sm tracking-widest uppercase hover:text-amber-500 transition-colors flex items-center gap-2">
                   View Trend Analytics &rarr;
                 </button>
               </div>
            </div>

            {/* Trend 2 */}
            <div className="bg-white border border-stone-200 p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow group relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
               <div className="relative z-10">
                 <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-green-200">
                    <MdOutlineNature size={24} />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-2 font-sans">Cultural Shift</p>
                 <h3 className="text-2xl font-display font-bold text-stone-900 mb-4">Eco-Friendly Dyes</h3>
                 <p className="text-stone-500 text-sm leading-relaxed mb-8">
                   Global buyers are actively filtering for "natural dye" and "sustainable" 3x more than last year. Highlighting natural ingredients in your next listing will dramatically boost trust.
                 </p>
                 <button className="text-green-700 font-bold text-sm tracking-widest uppercase hover:text-green-500 transition-colors flex items-center gap-2">
                   Update Active Listings &rarr;
                 </button>
               </div>
            </div>

            {/* Trend 3 */}
            <div className="bg-white border border-stone-200 p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow group relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
               <div className="relative z-10">
                 <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-blue-200">
                    <MdOutlineHandyman size={24} />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 font-sans">Product Gap</p>
                 <h3 className="text-2xl font-display font-bold text-stone-900 mb-4">Terracotta Drinkware</h3>
                 <p className="text-stone-500 text-sm leading-relaxed mb-8">
                   There is a massive shortage of authentic clay cups (Kulhads) and modern terracotta water bottles on the platform. Potters can fill this gap for immediate visibility.
                 </p>
                 <button className="text-blue-700 font-bold text-sm tracking-widest uppercase hover:text-blue-500 transition-colors flex items-center gap-2">
                   Create New Listing &rarr;
                 </button>
               </div>
            </div>

        </div>

      </div>
    </PageWrapper>
  );
};

export default SmartSuggestions;