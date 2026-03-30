import React, { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import { MdOutlineLightbulb, MdTrendingUp, MdOutlineNature, MdOutlineHandyman } from "react-icons/md";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const ICONS = [MdTrendingUp, MdOutlineNature, MdOutlineHandyman];
const COLORS = [
  { bg: "bg-amber-100", text: "text-amber-600", border: "border-amber-200", label: "text-amber-600", btn: "text-amber-700 hover:text-amber-500" },
  { bg: "bg-green-100", text: "text-green-600", border: "border-green-200", label: "text-green-600", btn: "text-green-700 hover:text-green-500" },
  { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200", label: "text-blue-600", btn: "text-blue-700 hover:text-blue-500" },
];

const SmartSuggestions = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const [productsSnap, ordersSnap] = await Promise.all([
          getDocs(collection(db, "products")),
          getDocs(collection(db, "orders")),
        ]);

        // Count orders per product
        const orderCounts = {};
        ordersSnap.forEach(doc => {
          const pid = doc.data().productId;
          if (pid) orderCounts[pid] = (orderCounts[pid] || 0) + 1;
        });

        // Aggregate by category
        const categoryMap = {};
        productsSnap.forEach(doc => {
          const data = doc.data();
          const cat = data.category || "Handcraft";
          if (!categoryMap[cat]) categoryMap[cat] = { count: 0, orders: 0, sample: data };
          categoryMap[cat].count++;
          categoryMap[cat].orders += orderCounts[doc.id] || 0;
        });

        const sorted = Object.entries(categoryMap)
          .sort((a, b) => b[1].orders - a[1].orders)
          .slice(0, 3)
          .map(([cat, info], i) => ({
            category: cat,
            count: info.count,
            orders: info.orders,
            sample: info.sample,
          }));

        // Fallback if no categories
        if (sorted.length === 0) {
          const products = productsSnap.docs.slice(0, 3).map(d => ({ id: d.id, ...d.data() }));
          setTrends(products.map(p => ({ category: p.name, count: 1, orders: 0, sample: p })));
        } else {
          setTrends(sorted);
        }
      } catch (err) {
        console.error("Error fetching trends:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  return (
    <PageWrapper className="w-full bg-[#FAF7F2] min-h-[90vh] pb-24 px-4 md:px-8 py-10 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/40 hidden lg:block" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}></div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="mb-14 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-200/50 border border-stone-300 mb-6 font-sans">
              <MdOutlineLightbulb className="text-stone-700" size={16} />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">Craft Intelligence</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-stone-900 font-display">
              Market <span className="text-emerald-600 italic">Opportunities.</span>
            </h1>
            <p className="mt-6 text-lg text-stone-600 leading-relaxed max-w-xl">
              Based on real platform orders, discover which craft categories are in highest demand right now.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-5 min-w-[200px]">
            <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
              <MdTrendingUp size={28} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1 mt-1 font-sans">Top Categories</p>
              <p className="text-2xl font-bold text-stone-800">{trends.length} <span className="text-sm font-medium text-stone-400">active</span></p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trends.map((trend, i) => {
              const Icon = ICONS[i % ICONS.length];
              const color = COLORS[i % COLORS.length];
              return (
                <div key={i} className="bg-white border border-stone-200 p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow group relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative z-10">
                    <div className={`w-12 h-12 ${color.bg} ${color.text} rounded-xl flex items-center justify-center mb-6 shadow-sm border ${color.border}`}>
                      <Icon size={24} />
                    </div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${color.label} mb-2 font-sans`}>
                      {trend.orders > 0 ? `${trend.orders} Orders` : "New Category"}
                    </p>
                    <h3 className="text-2xl font-display font-bold text-stone-900 mb-4">{trend.category}</h3>
                    <p className="text-stone-500 text-sm leading-relaxed mb-8">
                      {trend.count} product{trend.count !== 1 ? "s" : ""} listed in this category.
                      {trend.orders > 0
                        ? ` Buyers have placed ${trend.orders} order${trend.orders !== 1 ? "s" : ""} — high demand right now.`
                        : " No orders yet — be the first to capture this market gap."}
                    </p>
                    <button className={`${color.btn} font-bold text-sm tracking-widest uppercase transition-colors flex items-center gap-2`}>
                      View Trend &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default SmartSuggestions;
