import React, { useContext, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import { MdOutlineSupportAgent, MdMailOutline, MdChatBubbleOutline, MdSend } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";

const UserChat = () => {
  const { userName } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Artisans");

  return (
    <PageWrapper className="w-full bg-[#FAF7F2] min-h-[90vh] pb-24 px-4 md:px-8 py-10 overflow-hidden relative">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-stone-100/40 hidden lg:block" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}></div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        
        {/* EDITORIAL HEADER */}
        <div className="mb-14 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-200/50 border border-stone-300 mb-6 font-sans">
              <MdChatBubbleOutline className="text-stone-700" size={16} />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">Messages</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-stone-900 font-display">
              Creative <span className="text-stone-600 italic">Conversations.</span>
            </h1>
            <p className="mt-6 text-lg text-stone-600 leading-relaxed max-w-xl">
              Discuss custom commissions, inquire about heritage techniques, or track your handcrafted orders directly with the maker.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-5 min-w-[200px]">
             <div className="w-14 h-14 rounded-xl bg-stone-50 flex items-center justify-center text-stone-600 shrink-0 border border-stone-100">
                <MdMailOutline size={28} />
             </div>
             <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1 mt-1 font-sans">Unread Replies</p>
                <p className="text-2xl font-bold text-stone-800">0</p>
             </div>
          </div>
        </div>

        {/* INBOX SECTION */}
        <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px] font-sans">
           
           {/* SIDEBAR */}
           <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-stone-200 bg-stone-50/50 flex flex-col">
              <div className="p-6 border-b border-stone-200 flex gap-4">
                 <button onClick={() => setActiveTab('Artisans')} className={`text-xs font-bold uppercase tracking-widest pb-1 border-b-2 ${activeTab === 'Artisans' ? 'border-amber-500 text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-600'}`}>Artisans</button>
                 <button onClick={() => setActiveTab('Support')} className={`text-xs font-bold uppercase tracking-widest pb-1 border-b-2 ${activeTab === 'Support' ? 'border-amber-500 text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-600'}`}>Platform Support</button>
              </div>

              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                 <MdChatBubbleOutline className="text-stone-300 mb-3" size={32} />
                 <p className="text-stone-500 text-sm">No connected {activeTab === "Artisans" ? "creators" : "support agents"} yet.</p>
                 <p className="text-xs text-stone-400 mt-2 max-w-[200px]">Reach out from an artisan's profile to start a conversation.</p>
              </div>
           </div>

           {/* MAIN INBOX VIEW */}
           <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col items-center justify-center text-center bg-white relative">
              <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 mb-6 shadow-inner border border-stone-100">
                 <MdOutlineSupportAgent size={48} />
              </div>
              <h3 className="text-2xl font-display font-bold text-stone-800 mb-3">Your Inbox is Empty</h3>
              <p className="text-stone-500 max-w-sm leading-relaxed mb-8">
                Connect with artisans for custom orders or explore heritage sites to learn about ancient crafting techniques.
              </p>
              
              <div className="w-full max-w-md bg-stone-50 border border-stone-200 rounded-2xl p-2 flex gap-2">
                 <input type="text" placeholder="Type a message..." disabled className="flex-1 bg-transparent border-none outline-none px-4 text-sm text-stone-700 placeholder-stone-400" />
                 <button disabled className="bg-stone-200 text-stone-400 p-3 rounded-xl">
                    <MdSend size={18} />
                 </button>
              </div>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mt-4">Select a thread to reply</p>
           </div>

        </div>

      </div>
    </PageWrapper>
  );
};

export default UserChat;
