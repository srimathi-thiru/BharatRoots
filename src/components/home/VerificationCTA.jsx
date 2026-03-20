import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const VerificationCTA = () => {
  return (
    <section className="w-full py-24 bg-slate-900 relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px]"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 md:p-20 rounded-[3rem] shadow-2xl"
        >
           <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white font-display italic">
             Authenticate Your <span className="text-amber-400">Swadeshi</span> Purchase
           </h2>
           <p className="mb-10 text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
             Our next-gen verification system ensures that every product you buy is a genuine masterpiece from a verified artisan. No imitations, just pure heritage.
           </p>

           <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link 
                to="/verify" 
                className="bg-amber-400 text-slate-900 px-10 py-4 rounded-2xl font-black text-lg hover:bg-amber-500 hover:scale-105 transition-all duration-300 shadow-xl shadow-amber-400/20"
              >
                Verify Product Now
              </Link>
              <Link 
                to="/products" 
                className="text-white font-bold border-b border-white/30 pb-1 hover:border-amber-400 hover:text-amber-400 transition-all duration-300"
              >
                Browse Marketplace
              </Link>
           </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VerificationCTA;