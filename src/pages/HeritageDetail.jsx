import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import PageWrapper from "../components/PageWrapper";
import { AuthContext } from "../context/AuthContext";
import { FaArrowLeft, FaMapMarkerAlt, FaFeatherAlt, FaYoutube } from "react-icons/fa";
import { MdAutoAwesome, MdOpenInNew } from "react-icons/md";
import { generateHeritageStory, getYouTubeVideos } from "../services/aiService";

function HeritageDetail() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { userRole } = useContext(AuthContext);
  const [heritage, setHeritage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState("");
  const [storyLoading, setStoryLoading] = useState(false);
  const [storyGenerated, setStoryGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const handleGenerateStory = async () => {
    setStoryLoading(true);
    setActiveTab("story");
    const result = await generateHeritageStory(heritage);
    setStory(result);
    setStoryGenerated(true);
    setStoryLoading(false);
  };

  useEffect(() => {
    const fetchHeritage = async () => {
      try {
        const docRef = doc(db, "heritage", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // Check if pending and user is NOT admin
          if (data.status === "pending" && userRole?.toLowerCase() !== "admin") {
            setHeritage(null);
          } else {
            setHeritage(data);
          }
        } else {
          console.log("No such heritage found!");
        }
      } catch (error) {
        console.error("Error fetching heritage:", error);
      }
      setLoading(false);
    };

    fetchHeritage();
  }, [id]);

  if (loading) return <h2 className="text-center mt-20 text-zinc-500 font-bold">Loading Heritage Document...</h2>;
  if (!heritage) return <h2 className="text-center mt-20 text-zinc-500 font-bold">Heritage Not Found</h2>;

  return (
    <PageWrapper className="p-4 md:p-8 bg-[#FCFAFA] min-h-screen">
      
      <button 
        onClick={() => navigate('/heritage')}
        className="mb-6 flex flex-row items-center gap-2 text-sm font-bold text-zinc-500 hover:text-indigo-600 transition-colors uppercase tracking-widest mx-auto max-w-7xl"
      >
        <FaArrowLeft /> Back to Catalog
      </button>

      <div className="max-w-7xl mx-auto bg-white rounded-[2rem] shadow-sm border border-zinc-200 overflow-hidden">
        
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* Left: Image Box */}
          <div className="relative h-[400px] lg:h-auto bg-zinc-100">
            <img
              src={heritage.imageUrl}
              alt={heritage.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>

          {/* Right: Content Details */}
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                <FaFeatherAlt size={10} /> {heritage.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black font-display text-zinc-900 mb-6 tracking-tight leading-tight">
              {heritage.title}
            </h1>

            <p className="text-zinc-600 font-medium mb-10 flex items-center gap-2 bg-[#FCFAFA] p-4 rounded-xl border border-zinc-100 w-max">
              <span className="bg-amber-100 text-amber-600 p-2 rounded-lg">
                <FaMapMarkerAlt size={16} />
              </span>
              <span className="text-lg">Geotagged: <span className="font-bold text-zinc-900">{heritage.region}</span></span>
            </p>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === "description" ? "bg-zinc-900 text-amber-500" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => { setActiveTab("story"); if (!storyGenerated && !storyLoading) handleGenerateStory(); }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === "story" ? "bg-amber-500 text-zinc-900" : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                }`}
              >
                <MdAutoAwesome size={13} /> AI Story
              </button>
            </div>

            {activeTab === "description" && (
              <p className="text-zinc-600 text-lg leading-relaxed">{heritage.description}</p>
            )}

            {activeTab === "story" && (
              <div className="min-h-[120px]">
                {storyLoading ? (
                  <div className="space-y-3 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-4 bg-amber-100 rounded ${i === 3 ? "w-2/3" : "w-full"}`} />
                    ))}
                    <p className="text-xs text-amber-600 font-bold mt-4 flex items-center gap-1.5">
                      <MdAutoAwesome size={13} /> AI is crafting your story...
                    </p>
                  </div>
                ) : (
                  <p className="text-zinc-600 text-base leading-relaxed whitespace-pre-line">{story}</p>
                )}
              </div>
            )}

          </div>
        </div>

        {/* YouTube Recommendations */}
        <div className="border-t border-zinc-100 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="p-2 bg-red-50 rounded-xl text-red-600"><FaYoutube size={20} /></span>
            <div>
              <h3 className="text-lg font-black text-zinc-900">Explore on YouTube</h3>
              <p className="text-xs text-zinc-400 font-medium">Curated searches about this heritage</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getYouTubeVideos(heritage).map((video, i) => (
              <a
                key={i}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-3 p-5 rounded-2xl border border-zinc-200 bg-[#FCFAFA] hover:border-red-300 hover:bg-red-50/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 bg-red-100 rounded-lg text-red-600 group-hover:bg-red-200 transition-all">
                    <FaYoutube size={18} />
                  </span>
                  <MdOpenInNew size={14} className="text-zinc-300 group-hover:text-red-400 transition-all" />
                </div>
                <p className="text-sm font-semibold text-zinc-700 group-hover:text-zinc-900 leading-snug capitalize">
                  {video.label}
                </p>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-red-500 transition-all">
                  Search on YouTube →
                </span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}

export default HeritageDetail;