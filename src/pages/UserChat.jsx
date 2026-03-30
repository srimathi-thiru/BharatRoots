import React, { useContext, useState, useEffect, useRef } from "react";
import PageWrapper from "../components/PageWrapper";
import { MdOutlineSupportAgent, MdMailOutline, MdChatBubbleOutline, MdSend } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import {
  collection, addDoc, query, where, orderBy,
  onSnapshot, serverTimestamp, getDocs
} from "firebase/firestore";

const UserChat = () => {
  const { currentUser, userName } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Artisans");
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [newRecipient, setNewRecipient] = useState("");
  const [artisans, setArtisans] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const bottomRef = useRef(null);

  // Fetch artisans list for new chat
  useEffect(() => {
    getDocs(collection(db, "artisans")).then(snap => {
      setArtisans(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  // Fetch threads for current user
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

  const startNewThread = async (artisan) => {
    // Check if thread already exists
    const existing = threads.find(t =>
      t.participants.includes(artisan.userId || artisan.id)
    );
    if (existing) { setSelectedThread(existing); setShowNewChat(false); return; }

    const threadRef = await addDoc(collection(db, "chatThreads"), {
      participants: [currentUser.uid, artisan.userId || artisan.id],
      participantNames: { [currentUser.uid]: userName || "User", [artisan.userId || artisan.id]: artisan.name },
      lastMessage: "",
      updatedAt: serverTimestamp(),
    });
    setSelectedThread({ id: threadRef.id, participants: [currentUser.uid, artisan.userId || artisan.id], participantNames: { [currentUser.uid]: userName, [artisan.userId || artisan.id]: artisan.name } });
    setShowNewChat(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedThread) return;
    await addDoc(collection(db, "chatThreads", selectedThread.id, "messages"), {
      text: input.trim(),
      senderId: currentUser.uid,
      senderName: userName || "User",
      createdAt: serverTimestamp(),
    });
    setInput("");
  };

  const getOtherName = (thread) => {
    const otherId = thread.participants.find(p => p !== currentUser.uid);
    return thread.participantNames?.[otherId] || "Artisan";
  };

  return (
    <PageWrapper className="w-full bg-[#FAF7F2] min-h-[90vh] pb-24 px-4 md:px-8 py-10 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-stone-100/40 hidden lg:block" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}></div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-200/50 border border-stone-300 mb-6 font-sans">
            <MdChatBubbleOutline className="text-stone-700" size={16} />
            <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">Messages</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-stone-900 font-display">
            Creative <span className="text-stone-600 italic">Conversations.</span>
          </h1>
        </div>

        <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px] font-sans">
          {/* SIDEBAR */}
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-stone-200 bg-stone-50/50 flex flex-col">
            <div className="p-4 border-b border-stone-200 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-stone-700">Conversations</span>
              <button onClick={() => setShowNewChat(true)} className="text-xs font-bold bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 transition-colors">
                + New Chat
              </button>
            </div>

            {showNewChat && (
              <div className="p-4 border-b border-stone-200 bg-amber-50">
                <p className="text-xs font-bold text-stone-600 mb-2 uppercase tracking-widest">Select Artisan</p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {artisans.map(a => (
                    <button key={a.id} onClick={() => startNewThread(a)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-100 text-sm font-medium text-stone-800 transition-colors">
                      {a.name} <span className="text-stone-400 text-xs">— {a.specialization}</span>
                    </button>
                  ))}
                  {artisans.length === 0 && <p className="text-xs text-stone-400">No artisans found.</p>}
                </div>
                <button onClick={() => setShowNewChat(false)} className="mt-2 text-xs text-stone-400 hover:text-stone-600">Cancel</button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {threads.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <MdChatBubbleOutline className="text-stone-300 mb-3" size={32} />
                  <p className="text-stone-500 text-sm">No conversations yet.</p>
                  <p className="text-xs text-stone-400 mt-1">Click "+ New Chat" to message an artisan.</p>
                </div>
              ) : (
                threads.map(thread => (
                  <button key={thread.id} onClick={() => setSelectedThread(thread)}
                    className={`w-full text-left p-4 border-b border-stone-100 hover:bg-stone-100 transition-colors ${selectedThread?.id === thread.id ? "bg-amber-50 border-l-2 border-l-amber-500" : ""}`}>
                    <p className="font-bold text-stone-800 text-sm">{getOtherName(thread)}</p>
                    <p className="text-xs text-stone-400 truncate mt-0.5">{thread.lastMessage || "Start a conversation"}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* MAIN CHAT VIEW */}
          <div className="w-full md:w-2/3 flex flex-col bg-white">
            {!selectedThread ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 mb-6 shadow-inner border border-stone-100">
                  <MdOutlineSupportAgent size={48} />
                </div>
                <h3 className="text-2xl font-display font-bold text-stone-800 mb-3">Select a Conversation</h3>
                <p className="text-stone-500 max-w-sm leading-relaxed">Choose a thread from the left or start a new chat with an artisan.</p>
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
                    placeholder="Type a message..."
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

export default UserChat;
