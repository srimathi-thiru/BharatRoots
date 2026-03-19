import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "BharatRoots": "BharatRoots",
      "User Login": "User Login",
      "Artisan Login": "Artisan Login",
      "Global Search": "Global Search",
      "Search placeholder": "Search heritage, products...",
      "Voice Search": "Voice Search",
      "Heritage Results": "Heritage Results",
      "Product Results": "Product Results"
    }
  },
  hi: {
    translation: {
      "BharatRoots": "भारत रूट्स",
      "User Login": "उपयोगकर्ता लॉगिन",
      "Artisan Login": "कारीगर लॉगिन",
      "Global Search": "वैश्विक खोज",
      "Search placeholder": "विरासत, उत्पाद खोजें...",
      "Voice Search": "आवाज से खोजें",
      "Heritage Results": "विरासत परिणाम",
      "Product Results": "उत्पाद परिणाम"
    }
  },
  ta: {
    translation: {
      "BharatRoots": "பாரத் ரூட்ஸ்",
      "User Login": "பயனர் பதிவு",
      "Artisan Login": "கைவினைஞர் பதிவு",
      "Global Search": "உலகளாவிய தேடல்",
      "Search placeholder": "பாரம்பரியம், தயாரிப்புகளை தேடுங்கள்...",
      "Voice Search": "குரல் தேடல்",
      "Heritage Results": "பாரம்பரிய முடிவுகள்",
      "Product Results": "தயாரிப்பு முடிவுகள்"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
