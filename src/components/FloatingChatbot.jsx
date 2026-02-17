import React, { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

function FloatingChatbot() {

  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Namaste 🙏 I am BharatRoots AI Assistant. Ask me about heritage, products, or artisans."
    }
  ]);

  const [input, setInput] = useState("");


  const toggleChat = () => {
    setOpen(!open);
  };


  const sendMessage = async () => {

    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };

    setMessages(prev => [...prev, userMessage]);

    const reply = await generateReply(input);

    setMessages(prev => [...prev, { sender: "bot", text: reply }]);

    setInput("");
  };


  // SMART MATCH FUNCTION
  const matchesQuery = (data, query) => {

    const fields = [
      data.name,
      data.category,
      data.region,
      data.description,
      data.specialization
    ];

    for (let field of fields) {

      if (!field) continue;

      const value = field.toLowerCase();

      if (
        value.includes(query) ||
        query.includes(value)
      ) {
        return true;
      }
    }

    return false;
  };


  // MAIN REPLY FUNCTION
  const generateReply = async (question) => {

    try {

      const query = question.toLowerCase().trim();


      // SEARCH HERITAGE
      const heritageSnap = await getDocs(collection(db, "heritage"));

      for (let docItem of heritageSnap.docs) {

        const data = docItem.data();

        if (matchesQuery(data, query)) {

          return `🪔 ${data.name}
Region: ${data.region}
Category: ${data.category}
${data.description}`;
        }
      }



      // SEARCH PRODUCTS
      const productSnap = await getDocs(collection(db, "products"));

      for (let docItem of productSnap.docs) {

        const data = docItem.data();

        if (matchesQuery(data, query)) {

          return `🛍 ${data.name}
Price: ₹${data.price}
${data.description}`;
        }
      }



      // SEARCH ARTISANS
      const artisanSnap = await getDocs(collection(db, "artisans"));

      for (let docItem of artisanSnap.docs) {

        const data = docItem.data();

        if (matchesQuery(data, query)) {

          return `👨‍🎨 ${data.name}
Region: ${data.region}
Specialization: ${data.specialization}
Contact: ${data.contact}`;
        }
      }



      return "❌ Sorry, I couldn't find that in BharatRoots database.";


    } catch (error) {

      console.error(error);

      return "⚠ Error accessing database.";

    }

  };



  return (

    <div>

      {/* Floating Button */}

      <button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700"
      >
        💬
      </button>


      {/* Chat Window */}

      {open && (

        <div className="fixed bottom-20 right-5 w-80 bg-white shadow-lg rounded-lg">

          {/* Header */}

          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between">

            <span>BharatRoots AI</span>

            <button onClick={toggleChat}>
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
              placeholder="Ask something..."
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
