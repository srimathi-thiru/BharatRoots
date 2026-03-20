import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Reliable GeoJSON for India States from Geohacker
const INDIA_TOPO_JSON = "https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson";

// Color scale for density mapping (light orange to deep orange/red)
const colorScale = scaleLinear()
  .domain([0, 10])
  .range(["#ffedea", "#ff5233"]);

const HeritageMap = () => {
  const [data, setData] = useState({});
  const [tooltipContent, setTooltipContent] = useState("");

  useEffect(() => {
    fetchHeritageData();
  }, []);

  const fetchHeritageData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "heritage"));
      
      const regionCounts = {};
      querySnapshot.forEach((doc) => {
        const item = doc.data();
        if (item.region) {
            // Normalize region names to match standard map formatting
            const regionName = item.region.trim().toLowerCase();
            regionCounts[regionName] = (regionCounts[regionName] || 0) + 1;
        }
      });
      
      setData(regionCounts);
    } catch (error) {
      console.error("Error fetching map data:", error);
    }
  };

  return (
    <div className="w-full relative bg-blue-50/30 rounded-xl overflow-hidden shadow-inner border border-gray-100 p-2">
       
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur p-4 rounded-lg shadow text-sm">
         <h4 className="font-bold text-gray-800 mb-2">Heritage Density</h4>
         <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-[#ffedea] inline-block"></span>
            <span className="text-gray-600">Low density</span>
         </div>
         <div className="flex items-center gap-2 mt-1">
            <span className="w-4 h-4 rounded bg-[#ff5233] inline-block"></span>
            <span className="text-gray-600">High density</span>
         </div>
      </div>

      {tooltipContent && (
        <div className="absolute top-4 right-4 z-20 bg-indigo-900 text-white p-3 rounded-lg shadow-lg font-medium shadow-indigo-200">
           {tooltipContent}
        </div>
      )}

      <div className="h-[500px] w-full">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 1000,
            center: [80, 22] // Centered perfectly on India
          }}
          className="w-full h-full outline-none"
        >
          <ZoomableGroup zoom={1}>
            <Geographies geography={INDIA_TOPO_JSON}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stateName = geo.properties.NAME_1 ? geo.properties.NAME_1.toLowerCase() : "";
                  const count = data[stateName] || 0;
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        setTooltipContent(`${geo.properties.NAME_1}: ${count} Cultural Elements`);
                      }}
                      onMouseLeave={() => {
                        setTooltipContent("");
                      }}
                      style={{
                        default: {
                          fill: count > 0 ? colorScale(count) : "#f3f4f6", // Light gray if zero
                          stroke: "#d1d5db",
                          strokeWidth: 0.5,
                          outline: "none"
                        },
                        hover: {
                          fill: "#4f46e5", // Indigo pop on hover
                          stroke: "#312e81",
                          strokeWidth: 1,
                          outline: "none",
                          cursor: "pointer",
                          transition: "all 0.3s"
                        },
                        pressed: {
                          fill: "#3730a3",
                          outline: "none"
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </div>
  );
};

export default HeritageMap;
