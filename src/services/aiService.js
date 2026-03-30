/**
 * aiService.js
 * 
 * Simulates an AI/NLP model parsing unstructured cultural stories and heritage details
 * for the BharatRoots ecosystem. In a production environment, this would call 
 * an LLM API (like OpenAI GPT-4, Gemini, or Claude) or a custom SageMaker endpoint.
 */

// A mock mapping of keywords to regions for intelligent extraction
const REGIONS = [
  "Rajasthan", "Gujarat", "Tamil Nadu", "Kerala", "Karnataka", 
  "Maharashtra", "West Bengal", "Odisha", "Punjab", "Assam", 
  "Uttar Pradesh", "Bihar", "Madhya Pradesh", "Andhra Pradesh", "Telangana"
];

const CATEGORIES = {
  "Monument": ["fort", "temple", "palace", "ruin", "statue", "monument", "minar", "tomb"],
  "Craft": ["pottery", "saree", "weaving", "textile", "woodwork", "painting", "handicraft", "jewelry", "brass"],
  "Festival": ["diwali", "holi", "navratri", "pongal", "onam", "bihu", "festival", "dance", "celebration"]
};

// Helper to simulate network latency
const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const analyzeCulturalText = async (text) => {
  await delay(1500); // Simulate API call
  
  const lowerText = text.toLowerCase();
  
  // 1. Extract Region using NLP keyword mapping
  let expectedRegion = "Unknown Region";
  for (const region of REGIONS) {
    if (lowerText.includes(region.toLowerCase())) {
      expectedRegion = region;
      break;
    }
  }

  // 2. Extract Category
  let expectedCategory = "Monument"; // Default fallback
  for (const [cat, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some(kw => lowerText.includes(kw))) {
      expectedCategory = cat;
      break;
    }
  }

  // 3. Extract a concise summary / title (Mock logic: take first 3-5 words)
  const words = text.split(" ");
  let expectedTitle = "Cultural Heritage";
  if (words.length >= 3) {
      expectedTitle = words.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }

  return {
    title: expectedTitle,
    region: expectedRegion,
    category: expectedCategory,
    description: text // Use the full text as the mapped structured description
  };
};

export const generateHeritageStory = async (heritage) => {
  await delay(2000);

  const { title, region, category, description } = heritage;
  const lowerDesc = description?.toLowerCase() || "";

  const eraMap = {
    Monument: "ancient",
    Craft: "centuries-old",
    Festival: "timeless",
    Tradition: "age-old",
  };
  const era = eraMap[category] || "historic";

  const openings = [
    `Long before the modern world took shape, in the heart of ${region}, there existed a ${era} legacy known as ${title}.`,
    `Nestled in the cultural tapestry of ${region}, the story of ${title} has been whispered through generations.`,
    `In the golden era of Indian civilization, ${region} gave birth to something extraordinary — ${title}.`,
  ];

  const opening = openings[Math.floor(Math.random() * openings.length)];

  const craftLine = lowerDesc.includes("craft") || lowerDesc.includes("weav")
    ? ` Skilled artisans poured their soul into every creation, passing down techniques that no machine could replicate.`
    : "";

  const festivalLine = lowerDesc.includes("festival") || lowerDesc.includes("celebrat")
    ? ` The air would fill with music, color, and devotion as communities gathered in joyous celebration.`
    : "";

  const story = `${opening} ${description} ${craftLine}${festivalLine}

Today, ${title} stands as a proud symbol of India's undying cultural spirit. Preserving it is not merely an act of nostalgia — it is a commitment to the identity of a civilization that has endured for millennia. BharatRoots is honored to document and share this living heritage with the world.`;

  return story.trim();
};

export const getYouTubeSearchUrl = (heritage) => {
  const query = encodeURIComponent(`${heritage.title} ${heritage.region} heritage India`);
  return `https://www.youtube.com/embed?listType=search&list=${query}`;
};

export const getYouTubeVideos = (heritage) => {
  const queries = [
    `${heritage.title} ${heritage.region} history`,
    `${heritage.category} heritage India documentary`,
    `${heritage.region} culture tradition India`,
  ];
  return queries.map((q) => ({
    label: q,
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
    embedSearch: `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(q)}`,
  }));
};

export const analyzeCulturalImage = async (imageUrl) => {
    await delay(2000); // Simulate Vision API scanning
    // A mock Vision AI detection returning geographical metadata and tags
    return {
       visionTags: ["Culture", "Traditional", "Handmade"],
       confidenceScore: 0.94,
       suggestedRegion: "India" // In reality, vision APIs might identify specific landmarks
    };
};

export const suggestAyurvedicRemedy = async (symptoms) => {
    await delay(1800); // Simulate API latency
    
    const lowerSymptoms = symptoms.toLowerCase();
    
    // A mock AI response parsing the symptoms and generating Ayurvedic knowledge
    let remedy = {
        title: "Ayurvedic Immunity Tonic",
        description: "A traditional blend to safely boost immunity and promote natural healing.",
        ingredients: ["Tulsi (Holy Basil)", "Ginger", "Turmeric (Haldi)", "Honey"],
        instructions: "Boil the herbs in 2 cups of water for 10 minutes until reduced by half. Strain and add a teaspoon of honey. Drink warm twice a day.",
        precautions: "Consult a healthcare professional if symptoms persist."
    };

    if (lowerSymptoms.includes("fever") || lowerSymptoms.includes("infection")) {
        remedy = {
             title: "Ayurvedic Kadha for Fever",
             description: "A potent herbal decoction used in ancient Indian medicine to reduce body temperature and fight bacterial/viral infections.",
             ingredients: ["Giloy leaves", "Crushed Black Pepper", "Cinnamon", "Clove"],
             instructions: "Crush the spices and boil with Giloy leaves in 2 cups of water until it reduces to half. Drink while moderately warm.",
             precautions: "Do not consume on an entirely empty stomach."
        };
    } else if (lowerSymptoms.includes("cough") || lowerSymptoms.includes("cold")) {
        remedy = {
             title: "Adrak-Tulsi Elixir",
             description: "A soothing traditional mixture that heavily relieves throat irritation and clears congestion naturally.",
             ingredients: ["Fresh Ginger Juice", "Tulsi Extract", "Raw Honey", "Pinch of Black Salt"],
             instructions: "Mix equal parts of fresh ginger juice and honey. Add a pinch of black salt and consume slowly.",
             precautions: "Avoid drinking cold water for at least 30 minutes after consuming this."
        };
    } else if (lowerSymptoms.includes("digestion") || lowerSymptoms.includes("stomach")) {
        remedy = {
            title: "Jeera-Ajwain Digestive Water",
            description: "A reliable traditional remedy to improve gut health, balance doshas, and relieve bloating or severe indigestion.",
            ingredients: ["Cumin seeds (Jeera)", "Carom seeds (Ajwain)", "Fennel seeds (Saunf)", "Warm Water"],
            instructions: "Roast the seeds lightly and boil them in water. Let it simmer for 5 minutes. Drink immediately after meals.",
            precautions: "Have in moderation during peak summer heat as Ajwain has 'Ushna' (hot) properties."
       };
    }

    return remedy;
};
