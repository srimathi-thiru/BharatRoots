import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { suggestAyurvedicRemedy } from '../services/aiService';
import PageWrapper from '../components/PageWrapper';
import { MdSearch, MdHealthAndSafety, MdEco, MdLocalPharmacy } from 'react-icons/md';

const Remedies = () => {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [remedy, setRemedy] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    
    setLoading(true);
    setRemedy(null);
    setError('');

    try {
      const result = await suggestAyurvedicRemedy(symptoms);
      setRemedy(result);
    } catch (err) {
      setError('Failed to fetch a remedy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto py-8 flex flex-col min-h-[80vh]">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl mb-4 text-emerald-600 shadow-sm border border-emerald-200">
            <MdHealthAndSafety size={32} />
          </div>
          <h1 className="text-4xl font-black text-zinc-900 font-display mb-3 tracking-tight">Ayurvedic Remedies</h1>
          <p className="text-zinc-500 max-w-xl mx-auto text-lg leading-relaxed">
            Describe your symptoms to explore traditional Indian natural cures and holistic wellness recommendations based on ancient wisdom.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-200 mb-10 relative overflow-hidden">
           <form onSubmit={handleSearch} className="relative z-10 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                 <input 
                   type="text"
                   placeholder="E.g., fever, cold, cough, indigestion..."
                   value={symptoms}
                   onChange={(e) => setSymptoms(e.target.value)}
                   className="w-full pl-12 pr-6 py-4 bg-zinc-50 text-zinc-900 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-lg shadow-inner"
                 />
                 <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={28} />
              </div>
              <button 
                 type="submit"
                 disabled={loading || !symptoms.trim()}
                 className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold tracking-wide transition-all shadow-sm hover:shadow-md disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <MdLocalPharmacy size={20} />
                Find Remedy
              </button>
           </form>
           {/* Decorative Background element */}
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-60 z-0 pointer-events-none"></div>
        </div>

        {/* State Display Area */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {!loading && !remedy && !error && (
               <motion.div 
                 key="empty"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="flex flex-col items-center justify-center py-16 text-center h-full"
               >
                  <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mb-6 border border-zinc-100">
                     <MdEco className="text-zinc-300" size={48} />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-400">Discover Natural Healing</h3>
                  <p className="text-zinc-400 mt-2 max-w-sm">Enter a symptom above to receive traditional wellness insights deeply rooted in Indian culture.</p>
               </motion.div>
            )}

            {loading && (
               <motion.div 
                 key="loading"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="flex flex-col items-center justify-center py-20"
               >
                  <div className="relative w-24 h-24 mb-8">
                     <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-75"></div>
                     <div className="absolute inset-2 bg-emerald-200 rounded-full animate-pulse"></div>
                     <div className="absolute inset-4 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg">
                        <MdHealthAndSafety size={32} />
                     </div>
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-800 tracking-tight">Consulting Ancient Wisdom...</h3>
                  <p className="text-zinc-500 mt-2 font-medium">Sourcing traditional remedies for your symptoms.</p>
               </motion.div>
            )}

            {/* Results State */}
            {remedy && !loading && (
               <motion.div 
                 key="result"
                 initial={{ opacity: 0, scale: 0.98, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                 className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden mb-8"
               >
                  <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 sm:p-10 text-white relative overflow-hidden">
                     <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-900/30 rounded-full text-xs font-bold tracking-widest uppercase mb-4 border border-emerald-500/30 backdrop-blur-sm">
                           <MdEco />
                           Suggested Match
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black font-display mb-3 tracking-tight">{remedy.title}</h2>
                        <p className="text-emerald-50 text-lg max-w-2xl leading-relaxed">{remedy.description}</p>
                     </div>
                     <MdLocalPharmacy className="absolute -right-10 -bottom-12 text-white/10" size={220} />
                  </div>
                  
                  <div className="p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                     <div className="space-y-6">
                        <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-3 border-b border-zinc-100 pb-4">
                           <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-sm">1</span>
                           Key Ingredients
                        </h3>
                        <ul className="space-y-3">
                          {remedy.ingredients.map((ing, i) => (
                             <motion.li 
                               initial={{ opacity: 0, x: -10 }}
                               animate={{ opacity: 1, x: 0 }}
                               transition={{ delay: i * 0.1 }}
                               key={i} 
                               className="flex items-center gap-4 text-zinc-700 bg-zinc-50 p-4 rounded-2xl border border-zinc-100 font-medium"
                             >
                               <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                  <MdEco size={16} />
                               </div>
                               {ing}
                             </motion.li>
                          ))}
                        </ul>
                     </div>
                     
                     <div className="space-y-10">
                        <div className="space-y-6">
                          <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-3 border-b border-zinc-100 pb-4">
                             <span className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">2</span>
                             Preparation & Dosage
                          </h3>
                          <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-2xl text-indigo-900 leading-relaxed font-medium">
                             {remedy.instructions}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-bold text-red-900 flex items-center gap-2">
                             <span className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-lg shadow-sm font-black">!</span>
                             Precautions
                          </h3>
                          <p className="text-red-700 bg-red-50 p-5 rounded-2xl border border-red-100 font-medium">
                             {remedy.precautions}
                          </p>
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* Error State */}
            {error && !loading && (
               <motion.div 
                 key="error"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="text-center py-10"
               >
                  <div className="inline-flex w-16 h-16 bg-red-100 text-red-500 rounded-full items-center justify-center mb-4 border border-red-200">
                    <span className="text-2xl font-bold">!</span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">Something went wrong</h3>
                  <p className="text-zinc-500">{error}</p>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Remedies;
