import React, { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

function FloatingChatbot() {

  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Namaste 🙏 I am BharatRoots Assistant.\nAsk me about heritage, products, or artisans."
    }
  ]);

  const [input, setInput] = useState("");



  // ===============================
  // STOP WORDS (ignored words)
  // ===============================
  const STOP_WORDS = [
    "what","is","are","the","in","on","at","which","show",
    "find","give","me","about","tell","do","does","can",
    "you","please","a","an","of","for","to","and"
  ];



  // ===============================
  // EXTRACT KEYWORDS FUNCTION
  // ===============================
  const extractKeywords = (text) => {

    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(" ")
      .filter(word =>
        word.length > 2 &&
        !STOP_WORDS.includes(word)
      );

  };



  // ===============================
  // DETECT INTENT FUNCTION
  // ===============================
  const detectIntent = (keywords) => {

    if (
      keywords.some(word =>
        ["artisan","artisans","artist","craftsman"].includes(word)
      )
    ) {
      return "artisans";
    }

    if (
      keywords.some(word =>
        ["product","products","price","buy","saree"].includes(word)
      )
    ) {
      return "products";
    }

    return "heritage";

  };



  // ===============================
  // SEARCH FIRESTORE FUNCTION
  // ===============================
  const searchFirestore = async (collectionName, keywords) => {

    const snapshot = await getDocs(collection(db, collectionName));

    const results = [];

    snapshot.forEach(doc => {

      const data = doc.data();

      const searchableText = `
        ${data.name || ""}
        ${data.category || ""}
        ${data.region || ""}
        ${data.description || ""}
        ${data.specialization || ""}
      `.toLowerCase();

      const matchFound = keywords.some(keyword =>
        searchableText.includes(keyword)
      );

      if (matchFound) {
        results.push(data);
      }

    });

    return results;

  };



  // ===============================
  // GENERATE RESPONSE FUNCTION
  // ===============================
  const generateResponse = (results, intent) => {

    if (results.length === 0) {

      return `Sorry, I couldn't find matching ${intent}.
Try asking like:
• Heritage in Tamil Nadu
• Silk products
• Artisans in India`;

    }

    let reply = "";

    if (intent === "heritage")
      reply = "Here are some heritage items:\n\n";

    if (intent === "products")
      reply = "Here are some products:\n\n";

    if (intent === "artisans")
      reply = "Here are some artisans:\n\n";


    results.slice(0, 3).forEach((item, index) => {

      reply += `${index + 1}. ${item.name || "Item"}\n`;

      if (item.region)
        reply += `Region: ${item.region}\n`;

      if (item.category)
        reply += `Category: ${item.category}\n`;

      if (item.specialization)
        reply += `Specialization: ${item.specialization}\n`;

      if (item.price)
        reply += `Price: ₹${item.price}\n`;

      if (item.description)
        reply += `${item.description}\n`;

      reply += "\n";

    });

    return reply;

  };



  // ===============================
  // MAIN CHATBOT LOGIC
  // ===============================
  const generateReply = async (question) => {

    try {

      const normalized = question.toLowerCase().trim();

      // Greeting detection
      if (
        ["hi","hello","namaste","hey"].includes(normalized)
      ) {

        return `Namaste 🙏

You can ask:
• Heritage in Tamil Nadu
• Show silk products
• Find artisans`;

      }

      const keywords = extractKeywords(question);

      if (keywords.length === 0) {
        return "Please ask a meaningful question.";
      }

      const intent = detectIntent(keywords);

      const results = await searchFirestore(intent, keywords);

      return generateResponse(results, intent);

    }
    catch (error) {

      console.error(error);

      return "Error accessing database.";

    }

  };



  // ===============================
  // SEND MESSAGE FUNCTION
  // ===============================
  const sendMessage = async () => {

    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input
    };

    setMessages(prev => [...prev, userMessage]);

    const reply = await generateReply(input);

    const botMessage = {
      sender: "bot",
      text: reply
    };

    setMessages(prev => [...prev, botMessage]);

    setInput("");

  };



  // ===============================
  // UI
  // ===============================
  return (

    <div>

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700"
      >
        💬
      </button>



      {/* Chat Window */}
      {open && (

        <div className="fixed bottom-20 right-5 w-80 bg-white shadow-lg rounded-lg">

          {/* Header */}
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between">

            <span>BharatRoots Assistant</span>

            <button onClick={() => setOpen(false)}>
              ✖
            </button>

          </div>



          {/* Messages */}
          <div className="h-64 overflow-y-auto p-3">

            {messages.map((msg, index) => (

              <div
                key={index}
                className={`mb-2 ${
                  msg.sender === "user"
                    ? "text-right"
                    : "text-left"
                }`}
              >

                <span
                  className={`inline-block px-3 py-2 rounded-lg whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {msg.text}
                </span>

              </div>

            ))}

          </div>



          {/* Input */}
          <div className="flex border-t">

            <input
              className="flex-1 p-2 outline-none"
              placeholder="Ask about heritage, products, artisans..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4"
            >
              Send
            </button>

          </div>

        </div>

      )}

    </div>

  );

}

export default FloatingChatbot;