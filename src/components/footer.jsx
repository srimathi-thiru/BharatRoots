import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-[#0F172A] text-white pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Column */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-1.5 bg-indigo-600 rounded-lg">
              <img src="/bharatroots-logo.svg" alt="Logo" className="h-6 w-6 filter brightness-0 invert" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
            <h3 className="text-2xl font-bold font-display">Bharat<span className="text-indigo-400 font-normal">Roots</span></h3>
          </div>
          <p className="text-slate-400 text-sm font-light leading-relaxed mb-6">
            Preserving India's soul through digital infrastructure. We connect master artisans directly to the world, ensuring authenticity and heritage preservation.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
             <a href="#" className="hover:text-amber-400 transition-colors"><FaFacebook size={18} /></a>
             <a href="#" className="hover:text-amber-400 transition-colors"><FaTwitter size={18} /></a>
             <a href="#" className="hover:text-amber-400 transition-colors"><FaInstagram size={18} /></a>
             <a href="#" className="hover:text-amber-400 transition-colors"><FaLinkedin size={18} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Platform</h4>
          <ul className="space-y-4 text-slate-400 text-sm font-light">
             <li><Link to="/heritage" className="hover:text-white transition-colors">Heritage Archive</Link></li>
             <li><Link to="/products" className="hover:text-white transition-colors">Marketplace</Link></li>
             <li><Link to="/verify" className="hover:text-white transition-colors">Verfify Authenticity</Link></li>
             <li><Link to="/search" className="hover:text-white transition-colors">Search Network</Link></li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Support</h4>
          <ul className="space-y-4 text-slate-400 text-sm font-light">
             <li><Link to="/login/artisan" className="hover:text-white transition-colors">Artisan Portal</Link></li>
             <li><Link to="/login/user" className="hover:text-white transition-colors">User Login</Link></li>
             <li><Link className="hover:text-white transition-colors">Privacy Policy</Link></li>
             <li><Link className="hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Join the Movement</h4>
          <p className="text-slate-400 text-sm font-light mb-4 leading-relaxed">Get updates on new heritage discoveries and artisan spotlights.</p>
          <div className="flex gap-2">
             <input type="email" placeholder="Your email" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-amber-400 flex-1" />
             <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-700 transition">Join</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-xs font-medium italic">
          Digitally Architecting Bharat's Cultural Legacy.
        </p>
        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">
          © {new Date().getFullYear()} BharatRoots. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;