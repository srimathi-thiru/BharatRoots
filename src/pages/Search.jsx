import React, { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useTranslation } from "react-i18next";
import { FaMicrophone, FaMicrophoneSlash, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

function Search() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [heritageResults, setHeritageResults] = useState([]);
  const [productResults, setProductResults] = useState([]);
  const [isListening, setIsListening] = useState(false);

  const handleSearch = async (value) => {
    setQuery(value);

    if (!value) {
      setHeritageResults([]);
      setProductResults([]);
      return;
    }

    const heritageSnapshot = await getDocs(collection(db, "heritage"));
    const productSnapshot = await getDocs(collection(db, "products"));

    // FIXED: use title instead of name
    const heritageFiltered = heritageSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(item =>
        item.title?.toLowerCase().includes(value.toLowerCase()) ||
        item.category?.toLowerCase().includes(value.toLowerCase()) ||
        item.region?.toLowerCase().includes(value.toLowerCase())
      );

    const productFiltered = productSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(item =>
        item.name?.toLowerCase().includes(value.toLowerCase()) ||
        item.description?.toLowerCase().includes(value.toLowerCase())
      );

    setHeritageResults(heritageFiltered);
    setProductResults(productFiltered);
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Voice Search.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN"; // Can be mapped dynamically to i18n
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      handleSearch(transcript); 
    };

    recognition.start();
  };

  return (
    <PageWrapper className="py-12 px-4 max-w-4xl mx-auto min-h-[70vh]">

      <div className="text-center mb-10">
        <h1 className="text-4xl font-black font-display text-zinc-900 tracking-tight mb-4">{t("Global Search")}</h1>
        <p className="text-zinc-500 font-medium">Use voice or text to find artifacts, heritage sites, and verified artisans.</p>
      </div>

      <div className="relative mb-12 shadow-sm rounded-2xl group focus-within:shadow-md transition-shadow">
        <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
        <input
          type="text"
          placeholder={t("Search placeholder")}
          className="w-full p-5 pl-16 pr-16 bg-white border-2 border-zinc-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-lg font-medium transition-all text-zinc-900 placeholder:text-zinc-400"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <button
          onClick={startVoiceSearch}
          className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${isListening ? 'bg-red-50 text-red-500 animate-pulse border border-red-200' : 'bg-[#FCFAFA] border border-zinc-200 text-zinc-400 hover:text-indigo-600 hover:border-indigo-200'}`}
          title={t("Voice Search")}
        >
          {isListening ? <FaMicrophoneSlash size={20} /> : <FaMicrophone size={20} />}
        </button>
      </div>

      {/* Heritage Results */}
      {heritageResults.length > 0 && (
        <div className="mb-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 pb-2 border-b border-zinc-200">{t("Heritage Results")}</h2>

          <div className="space-y-3">
            {heritageResults.map(item => (
              <Link to={`/heritage/${item.id}`} key={item.id} className="block">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-200 hover:shadow-md hover:border-indigo-200 transition-all flex justify-between items-center group">
                  <div>
                    <h3 className="font-bold text-zinc-900 font-display text-lg group-hover:text-indigo-600 transition-colors mb-1">{item.title}</h3>
                    <p className="text-zinc-500 text-sm flex items-center gap-1">
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                       {item.region}
                    </p>
                  </div>
                  <span className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Product Results */}
      {productResults.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 pb-2 border-b border-zinc-200">{t("Product Results")}</h2>

          <div className="space-y-3">
            {productResults.map(item => (
              <Link to={`/product/${item.id}`} key={item.id} className="block">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-200 hover:shadow-md hover:border-amber-400 transition-all flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    {item.imageUrl && (
                       <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-zinc-100" />
                    )}
                    <div>
                      <h3 className="font-bold text-zinc-900 font-display text-lg group-hover:text-amber-600 transition-colors mb-1">{item.name}</h3>
                      <p className="text-indigo-600 font-bold text-sm">₹{item.price}</p>
                    </div>
                  </div>
                  <span className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!query && (
         <div className="text-center py-20">
            <p className="text-zinc-400 italic">Try searching for "Madhubani" or "Banarasi Silk"</p>
         </div>
      )}

      {query && heritageResults.length === 0 && productResults.length === 0 && (
         <div className="text-center py-20 bg-white rounded-3xl border border-zinc-200 shadow-sm">
            <p className="text-zinc-500 font-bold text-lg">No results found for "{query}"</p>
            <p className="text-zinc-400 mt-2">Try adjusting your search terms.</p>
         </div>
      )}

    </PageWrapper>
  );
}

export default Search;
