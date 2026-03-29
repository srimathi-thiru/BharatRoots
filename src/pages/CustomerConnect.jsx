import React, { useContext } from "react";
import PageWrapper from "../components/PageWrapper";
import { MdOutlineSupportAgent, MdMailOutline, MdChatBubbleOutline, MdOutlineHistory } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";

const CustomerConnect = () => {
  const { userName } = useContext(AuthContext);

  return (
    <PageWrapper className="w-full bg-[#FAF7F2] min-h-[90vh] pb-24 px-4 md:px-8 py-10 overflow-hidden relative">
      
      {/* BACKGROUND ELEMENTS (Warm, earthy) */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-50/40 hidden lg:block" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}></div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        
        {/* EDITORIAL HEADER */}
        <div className="mb-14 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-200/50 border border-stone-300 mb-6 font-sans">
              <MdOutlineSupportAgent className="text-stone-700" size={16} />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">Community Relations</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-stone-900 font-display">
              Community <span className="text-amber-600 italic">Connect.</span>
            </h1>
            <p className="mt-6 text-lg text-stone-600 leading-relaxed max-w-xl">
              Build lasting relationships with buyers. Respond to inquiries about your traditional techniques and arrange custom handmade commissions.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-5 min-w-[200px]">
             <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 border border-amber-100">
                <MdChatBubbleOutline size={28} />
             </div>
             <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1 mt-1 font-sans">Unread Inquiries</p>
                <p className="text-2xl font-bold text-stone-800">0 <span className="text-sm font-medium text-stone-400">pending</span></p>
             </div>
          </div>
        </div>

        {/* INBOX SECTION */}
        <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px] font-sans">
           
           {/* SIDEBAR */}
           <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-stone-200 bg-stone-50/50 p-6">
              <h2 className="font-bold text-stone-800 mb-6 uppercase tracking-widest text-xs">Message Folders</h2>
              
              <ul className="space-y-2">
                <li>
                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white border border-stone-200 shadow-sm text-stone-900 hover:bg-stone-50 transition-colors">
                     <span className="flex items-center gap-3 font-bold text-sm"><MdMailOutline size={18} className="text-stone-400" /> Inbox</span>
                     <span className="bg-stone-100 text-stone-500 text-[10px] font-bold px-2 py-0.5 rounded">0</span>
                  </button>
                </li>
                <li>
                  <button className="w-full flex items-center justify-between p-4 rounded-xl text-stone-500 hover:bg-stone-100 transition-colors">
                     <span className="flex items-center gap-3 font-medium text-sm"><MdChatBubbleOutline size={18} /> Custom Commissions</span>
                  </button>
                </li>
                <li>
                  <button className="w-full flex items-center justify-between p-4 rounded-xl text-stone-500 hover:bg-stone-100 transition-colors">
                     <span className="flex items-center gap-3 font-medium text-sm"><MdOutlineHistory size={18} /> Archive</span>
                  </button>
                </li>
              </ul>
              
              <div className="mt-10 p-6 bg-amber-50 border border-amber-100 rounded-xl relative overflow-hidden">
                 <div className="relative z-10">
                    <p className="font-bold text-amber-800 text-sm mb-2">Build Trust.</p>
                    <p className="text-amber-700/80 text-xs leading-relaxed">Buyers who connect directly with artisans are 80% more likely to become returning patrons of Swadeshi goods.</p>
                 </div>
              </div>
           </div>

           {/* MAIN INBOX VIEW */}
           <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col items-center justify-center text-center bg-white relative">
              <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 mb-6 shadow-inner border border-stone-100">
                 <MdOutlineSupportAgent size={48} />
              </div>
              <h3 className="text-2xl font-display font-bold text-stone-800 mb-3">Your Inbox is Clear</h3>
              <p className="text-stone-500 max-w-sm leading-relaxed mb-8">
                You have no pending requests or messages from buyers. We will notify you directly when a patron reaches out about your authentic crafts.
              </p>
              <button className="px-6 py-3 bg-stone-100 text-stone-500 text-sm font-bold rounded-xl hover:bg-stone-200 transition-colors">
                 Refresh Inbox
              </button>
           </div>

        </div>

      </div>
    </PageWrapper>
  );
};

export default CustomerConnect;