import React, { useContext, useState, useEffect, useRef } from "react";
import PageWrapper from "../components/PageWrapper";
import { MdOutlineSupportAgent, MdMailOutline, MdChatBubbleOutline, MdOutlineHistory, MdSend } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import {
  collection, addDoc, query, where, orderBy,
  onSnapshot, serverTimestamp
} from "firebase/firestore";

const CustomerConnect = () => {
  const { currentUser, userName } = useContext(AuthContext);
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // Fetch threads where artisan is a participant
  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, "chatThreads"), where("participants", "array-contains", currentUser.uid));
    const unsub = onSnapshot(q, snap => {
      setThreads(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [currentUser]);

  // Fetch messages for selected thread
  useEffect(() => {
    if (!selectedThread) return;
    const q = query(
      collection(db, "chatThreads", selectedThread.id, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return () => unsub();
  }, [selectedThread]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedThread) return;
    await addDoc(collection(db, "chatThreads", selectedThread.id, "messages"), {
      text: input.trim(),
      senderId: currentUser.uid,
      senderName: userName || "Artisan",
      createdAt: serverTimestamp(),
    });
    setInput("");
  };

  const getOtherName = (thread) => {
    const otherId = thread.participants.find(p => p !== currentUser.uid);
    return thread.participantNames?.[otherId] || "Customer";
  };

  return (
    <PageWrapper className="w-full bg-[#FAF7F2] min-h-[90vh] pb-24 px-4 md:px-8 py-10 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-50/40 hidden lg:block" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}></div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-200/50 border border-stone-300 mb-6 font-sans">
            <MdOutlineSupportAgent className="text-stone-700" size={16} />
            <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">Community Relations</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-stone-900 font-display">
            Community <span className="text-amber-600 italic">Connect.</span>
          </h1>
          <p className="mt-4 text-lg text-stone-600 max-w-xl">
            Respond to buyer inquiries and arrange custom commissions directly.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px] font-sans">
          {/* SIDEBAR */}
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-stone-200 bg-stone-50/50 flex flex-col">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-stone-700">Inbox</span>
              <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                {threads.length} thread{threads.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto">
              {threads.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <MdMailOutline className="text-stone-300 mb-3" size={32} />
                  <p className="text-stone-500 text-sm">No messages yet.</p>
                  <p className="text-xs text-stone-400 mt-1">Buyers will reach out from your product pages.</p>
                </div>
              ) : (
                threads.map(thread => (
                  <button key={thread.id} onClick={() => setSelectedThread(thread)}
                    className={`w-full text-left p-4 border-b border-stone-100 hover:bg-stone-100 transition-colors ${selectedThread?.id === thread.id ? "bg-amber-50 border-l-2 border-l-amber-500" : ""}`}>
                    <p className="font-bold text-stone-800 text-sm">{getOtherName(thread)}</p>
                    <p className="text-xs text-stone-400 truncate mt-0.5">{thread.lastMessage || "New conversation"}</p>
                  </button>
                ))
              )}
            </div>

            <div className="p-4 bg-amber-50 border-t border-amber-100">
              <p className="font-bold text-amber-800 text-xs mb-1">Build Trust.</p>
              <p className="text-amber-700/80 text-xs leading-relaxed">Buyers who connect directly with artisans are 80% more likely to become returning patrons.</p>
            </div>
          </div>

          {/* MAIN CHAT VIEW */}
          <div className="w-full md:w-2/3 flex flex-col bg-white">
            {!selectedThread ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 mb-6 shadow-inner border border-stone-100">
                  <MdOutlineSupportAgent size={48} />
                </div>
                <h3 className="text-2xl font-display font-bold text-stone-800 mb-3">Your Inbox is Clear</h3>
                <p className="text-stone-500 max-w-sm leading-relaxed">Select a conversation from the left to reply to a buyer.</p>
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-stone-200 bg-stone-50">
                  <p className="font-bold text-stone-800">{getOtherName(selectedThread)}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.senderId === currentUser.uid ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm font-medium ${msg.senderId === currentUser.uid ? "bg-amber-500 text-white" : "bg-stone-100 text-stone-800"}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
                <div className="p-4 border-t border-stone-200 flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder="Reply to customer..."
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-amber-400 transition-colors"
                  />
                  <button onClick={sendMessage} className="bg-amber-500 text-white p-3 rounded-xl hover:bg-amber-600 transition-colors">
                    <MdSend size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CustomerConnect;
