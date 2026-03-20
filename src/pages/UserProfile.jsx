import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import PageWrapper from "../components/PageWrapper";
import { MdPersonOutline, MdEmail } from "react-icons/md";

function UserProfile() {
  const { currentUser, userName, userRole } = useContext(AuthContext);

  if (!currentUser) return null;

  return (
    <PageWrapper className="py-12 px-4 max-w-4xl mx-auto">
      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-zinc-200 relative overflow-hidden">
        
        {/* Decorative Graphic */}
        <MdPersonOutline className="absolute -right-10 -top-10 text-indigo-50/50" size={250} />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 border-b border-zinc-100 pb-10 mb-10">
          <div className="h-32 w-32 rounded-full bg-zinc-900 text-amber-400 flex items-center justify-center font-display font-black text-6xl shadow-xl border-4 border-white">
            {(userName || "U")[0].toUpperCase()}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black font-display text-zinc-900 tracking-tight mb-2">
              {userName || "User Profile"}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-500 font-medium bg-[#FCFAFA] px-4 py-2 rounded-xl border border-zinc-100 w-fit mx-auto md:mx-0">
               <MdEmail size={18} className="text-indigo-400" />
               <span className="text-sm">{currentUser.email}</span>
            </div>
            
            <div className="mt-4">
              <span className="inline-block bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-md">
                 Account Role: {userRole || "USER"}
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#FCFAFA] p-6 rounded-2xl border border-zinc-100 shadow-inner">
             <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 pb-2 border-b border-zinc-200">Account Details</h3>
             <div className="space-y-4">
                <div>
                   <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Status</p>
                   <p className="font-medium text-emerald-600 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span> Active Account
                   </p>
                </div>
                <div>
                   <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Member Since</p>
                   <p className="font-medium text-zinc-900">{currentUser.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : "Recently Joined"}</p>
                </div>
             </div>
          </div>

          <div className="bg-[#FCFAFA] p-6 rounded-2xl border border-zinc-100 shadow-inner space-y-4">
             <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 pb-2 border-b border-zinc-200">Preferences</h3>
             <p className="text-zinc-500 text-sm leading-relaxed">
               You are currently viewing BharatRoots with the premium visual experience enabled. You can trace authentic artifacts using your verified ledger.
             </p>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}

export default UserProfile;
