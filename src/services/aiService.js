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

export const analyzeCulturalImage = async (imageUrl) => {
    await delay(2000); // Simulate Vision API scanning
    // A mock Vision AI detection returning geographical metadata and tags
    return {
       visionTags: ["Culture", "Traditional", "Handmade"],
       confidenceScore: 0.94,
       suggestedRegion: "India" // In reality, vision APIs might identify specific landmarks
    };
};
