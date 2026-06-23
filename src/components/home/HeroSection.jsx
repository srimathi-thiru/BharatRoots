import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center pt-20 overflow-hidden bg-[#F8F5F2]">
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-50/50 clip-path-hero hidden lg:block"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT CONTENT */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl text-center lg:text-left mx-auto lg:mx-0"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">The Swadeshi Marketplace & Archive</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-bold mb-6 md:mb-8 leading-[1.1] text-slate-900 font-display">
            Authentic <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-amber-600">Indian Heritage</span>
          </h1>

          <p className="text-base md:text-xl text-slate-600 mb-8 md:mb-10 leading-relaxed font-light">
            Discover real, verified masterpieces from master artisans across India. Preserving traditions through a next-generation digital storefront and living archive.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-5 justify-center lg:justify-start">
            <Link 
              to="/products" 
              className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-3 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-200"
            >
              <span className="relative z-10">Shop Marketplace</span>
              <div className="bg-indigo-600 absolute inset-0 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300"></div>
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </Link>

            <Link 
              to="/heritage" 
              className="px-8 py-4 border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-white hover:border-slate-900 transition-all duration-300"
            >
              Explore Archive
            </Link>
          </div>

          {/* METRICS */}
          <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-3 gap-6">
             <div>
                <p className="text-2xl font-bold text-slate-900">100%</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">Authentic</p>
             </div>
             <div>
                <p className="text-2xl font-bold text-slate-900">Direct</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">To Artisan</p>
             </div>
             <div>
                <p className="text-2xl font-bold text-slate-900">Live</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">Heritage Map</p>
             </div>
          </div>
        </motion.div>

        {/* RIGHT IMAGE/INTERACTIVE */}
        <motion.div
           initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
           whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1, ease: "circOut" }}
           className="relative"
        >
           <div className="aspect-[4/5] bg-white rounded-[2rem] shadow-2xl p-4 relative overflow-hidden group">
              <div className="w-full h-full bg-slate-100 rounded-[1.5rem] overflow-hidden relative">
                 <img 
                    src="https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=800&q=80" 
                    alt="Indian Heritage Craft - Artisan Pottery" 
                    className="w-full h-full object-cover grayscale-[0.2] transition-transform duration-700 group-hover:scale-110" 
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1610715936287-6c2ad208cdbf?auto=format&fit=crop&w=800&q=80" }}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                 <div className="absolute bottom-8 left-8 right-8 text-white">
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">Heritage</p>
                    <h3 className="text-2xl font-display font-bold italic">Preserving the Roots</h3>
                 </div>
              </div>
              
              {/* ACCENT FLOATERS */}
              <div className="absolute top-10 -left-6 bg-white p-4 rounded-xl shadow-xl hidden md:block animate-bounce-slow">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">✓</div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase">Verified</p>
                       <p className="text-sm font-bold text-slate-800 tracking-tight">Authentic Crafts</p>
                    </div>
                 </div>
              </div>
           </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;