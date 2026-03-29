import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import PageWrapper from "../components/PageWrapper";
import { MdOutlineStorefront, MdTrendingUp, MdPublic, MdClose, MdEditDocument, MdOutlineHandyman } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { analyzeCulturalText } from "../services/aiService";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

const CreatorStudio = () => {
  const { userName, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftPrompt, setDraftPrompt] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);

  // Dynamic Metrics
  const [metrics, setMetrics] = useState({
    productsCount: 0,
    profileCompletion: 20, 
    trendingRegion: "Loading...",
    catalogValue: 0,
  });

  useEffect(() => {
    fetchMetrics();
  }, [currentUser]);

  const fetchMetrics = async () => {
    if (!currentUser) return;
    try {
      const pQuery = query(collection(db, "products"), where("artisanId", "==", currentUser.uid));
      const pSnapshot = await getDocs(pQuery);
      const productCount = pSnapshot.size;
      
      let totalValue = 0;
      pSnapshot.forEach(doc => {
         totalValue += Number(doc.data().price || 0);
      });

      const artisanRef = doc(db, "artisans", currentUser.uid);
      const artisanSnap = await getDoc(artisanRef);
      
      let completion = 20; 
      if (artisanSnap.exists()) {
         const data = artisanSnap.data();
         if (data.businessName && data.businessName.length > 2) completion += 20;
         if (data.specialty && data.specialty.length > 2) completion += 20;
         if (data.phone && data.phone.length > 5) completion += 20;
         if (data.address && data.address.length > 5) completion += 20;
      }

      setMetrics({
         productsCount: productCount,
         profileCompletion: Math.min(completion, 100),
         catalogValue: totalValue,
         trendingRegion: productCount > 0 ? "South India" : "No active data",
      });

    } catch (error) {
      console.error("Error fetching workshop metrics:", error);
    }
  };

  const handleDraftListing = async () => {
    if (!draftPrompt.trim()) {
      toast.error("Please describe your craft first.");
      return;
    }
    setIsDrafting(true);
    const pendingToast = toast.loading("Formulating your listing...");
    try {
      const response = await analyzeCulturalText(draftPrompt);
      toast.success("Listing drafted successfully!", { id: pendingToast });
      navigate("/add-product", { state: { aiDraft: response } });
    } catch (error) {
      toast.error("Drafting failed. Please try again.", { id: pendingToast });
      setIsDrafting(false);
    }
  };

  return (
    <PageWrapper className="w-full bg-[#FAF7F2] min-h-[90vh] pb-24 px-4 md:px-8 py-10 overflow-hidden relative">
      
      {/* BACKGROUND ELEMENTS (Warm, earthy) */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-50/50 hidden lg:block" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}></div>

      {/* DRAFT MODAL */}
      {showDraftModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden relative border border-stone-200">
              
              <div className="bg-[#FAF7F2] border-b border-stone-200 p-6 relative flex justify-between items-start">
                 <div>
                    <h3 className="font-display font-bold text-2xl flex items-center gap-2 text-stone-800 mb-1">
                      <MdEditDocument className="text-amber-600" /> Listing Assistant
                    </h3>
                    <p className="text-stone-500 font-medium text-sm">Let us help you write a beautiful description for your handmade craft.</p>
                 </div>
                 <button onClick={() => setShowDraftModal(false)} disabled={isDrafting} className="p-2 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors text-stone-600 disabled:opacity-50">
                    <MdClose size={20} />
                 </button>
              </div>

              <div className="p-8">
                 <label className="text-sm font-bold text-stone-600 mb-3 block">Tell us about your masterpiece</label>
                 <textarea 
                    value={draftPrompt}
                    onChange={(e) => setDraftPrompt(e.target.value)}
                    placeholder="e.g. A gorgeous clay pot hand-molded in Jaipur using traditional techniques passed down over three generations..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 min-h-[160px] resize-none focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-stone-900 placeholder:text-stone-400 text-base transition-all"
                 />
                 
                 <div className="mt-8 flex justify-end gap-3">
                    <button 
                      onClick={() => setShowDraftModal(false)} 
                      disabled={isDrafting}
                      className="px-6 py-2.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors disabled:opacity-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleDraftListing}
                      disabled={isDrafting}
                      className="px-6 py-2.5 bg-amber-600 text-white rounded-lg font-bold shadow-md hover:bg-amber-700 transition-colors disabled:opacity-70 flex items-center gap-2"
                    >
                      {isDrafting ? "Writing..." : "Help Me Write"} <MdEditDocument />
                    </button>
                 </div>
              </div>

           </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        
        {/* HEADER */}
        <div className="mb-14 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/50 border border-amber-200 mb-6">
              <MdOutlineHandyman className="text-amber-700" size={16} />
              <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">Artisan Workshop</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-stone-900 font-display">
              Your Digital <span className="text-amber-600 italic">Workstation.</span>
            </h1>
            <p className="mt-6 text-lg text-stone-600 leading-relaxed max-w-xl">
              Welcome back, <span className="font-semibold text-stone-900">{userName || "Artisan"}</span>. Manage your traditional crafts, track your store's value, and bring your manual work to the digital marketplace.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-5 min-w-[280px]">
             <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0 border border-green-100">
                <MdOutlineStorefront size={28} />
             </div>
             <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1 mt-1">Total Catalog Value</p>
                <p className="text-2xl font-bold text-stone-800">₹{metrics.catalogValue.toLocaleString()}</p>
             </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Listing Assistant Block */}
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-stone-200 p-8 md:p-10 relative">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                   <MdEditDocument size={24} />
                </div>
                <h2 className="text-2xl font-display font-bold text-stone-900 mb-3">
                  Catalog Writing Assistant
                </h2>
                <p className="text-stone-500 text-base mb-8 max-w-md leading-relaxed">
                  Focus on your craft, not your keyboard. Describe your manual work in your own words, and we'll format it into a beautiful marketplace listing.
                </p>
                
                <button 
                  onClick={() => setShowDraftModal(true)}
                  className="px-6 py-3 bg-stone-900 text-white rounded-xl font-bold shadow-sm hover:bg-stone-800 transition-colors w-fit flex items-center gap-2"
                >
                  <MdEditDocument /> Start a Draft
                </button>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid sm:grid-cols-2 gap-6">
               <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-200 relative overflow-hidden flex flex-col justify-between">
                 <div>
                    <MdTrendingUp className="text-green-600 mb-4" size={28} />
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Handmade Goods Listed</p>
                    <div className="flex items-end gap-2">
                      <p className="text-4xl font-bold text-stone-900">{metrics.productsCount}</p>
                    </div>
                 </div>
                 
                 <div className="w-full bg-stone-100 h-1.5 rounded-full mt-6 overflow-hidden">
                   <div 
                      className="bg-green-500 h-full transition-all duration-1000" 
                      style={{ width: `${Math.min((metrics.productsCount / 10) * 100, 100)}%` }}
                   ></div>
                 </div>
               </div>

               <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-200 relative overflow-hidden flex flex-col justify-between">
                 <div>
                    <MdPublic className="text-amber-500 mb-4" size={28} />
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Trust & Authenticity Score</p>
                    <div className="flex items-end gap-2">
                      <p className="text-4xl font-bold text-stone-900">{metrics.profileCompletion}%</p>
                    </div>
                 </div>
                 
                 <div>
                    <div className="w-full bg-stone-100 h-1.5 rounded-full mt-6 overflow-hidden">
                      <div 
                         className="bg-amber-400 h-full transition-all duration-1000" 
                         style={{ width: `${metrics.profileCompletion}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] font-medium text-stone-400 mt-3">Complete your profile to build trust.</p>
                 </div>
               </div>
            </div>

          </div>

          {/* RIGHT COLUMN - AUTHENTIC IMAGE */}
          <div className="lg:col-span-5 h-[400px] lg:h-auto lg:min-h-full rounded-[2.5rem] bg-white shadow-md overflow-hidden relative group border border-stone-200">
              <img 
                 src="https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=800&q=80" 
                 alt="Artisan Crafting" 
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/30 to-transparent"></div>
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                 <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">Cultural Impact</p>
                    <h3 className="text-white text-xl font-display font-bold mb-2">Preserving Roots</h3>
                    <p className="text-white/80 text-sm font-medium leading-relaxed">
                      Your authentic crafts are currently gaining interest from buyers around <span className="font-bold text-white tracking-widest uppercase">{metrics.trendingRegion}</span>!
                    </p>
                 </div>
              </div>
          </div>

        </div>

      </div>
    </PageWrapper>
  );
};

export default CreatorStudio;
