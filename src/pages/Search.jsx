import React, { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useTranslation } from "react-i18next";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

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
    <div className="max-w-4xl mx-auto mt-10">

      <h1 className="text-3xl font-bold mb-6">{t("Global Search")}</h1>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder={t("Search placeholder")}
          className="w-full p-3 border rounded pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <button
          onClick={startVoiceSearch}
          className={`absolute right-3 top-3 transition ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-indigo-600'}`}
          title={t("Voice Search")}
        >
          {isListening ? <FaMicrophoneSlash size={22} /> : <FaMicrophone size={22} />}
        </button>
      </div>

      {/* Heritage Results */}
      {heritageResults.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-2">{t("Heritage Results")}</h2>

          {heritageResults.map(item => (
            <div key={item.id} className="border p-3 mb-2 rounded bg-white shadow">
              <h3 className="font-bold text-blue-600">{item.title}</h3>
              <p className="text-gray-600">{item.region}</p>
            </div>
          ))}
        </>
      )}

      {/* Product Results */}
      {productResults.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-6 mb-2">{t("Product Results")}</h2>

          {productResults.map(item => (
            <div key={item.id} className="border p-3 mb-2 rounded bg-white shadow">
              <h3 className="font-bold text-green-600">{item.name}</h3>
              <p className="text-gray-600">₹{item.price}</p>
            </div>
          ))}
        </>
      )}

    </div>
  );
}

export default Search;
