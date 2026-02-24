const crafts = [
  { name: "Kanchipuram Silk", region: "Tamil Nadu" },
  { name: "Madhubani Painting", region: "Bihar" },
  { name: "Blue Pottery", region: "Rajasthan" },
  { name: "Ikat Weaving", region: "Odisha" }
];

const FeaturedCrafts = () => {
  return (
    <section className="py-20 bg-[#FAF7F2]">
      <h2 className="text-3xl font-bold text-center mb-12">
        Featured Crafts of India
      </h2>

      <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
        {crafts.map((craft, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow
            hover:scale-105 transition"
          >
            <h3 className="font-semibold text-lg text-orange-600">
              {craft.name}
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              {craft.region}
            </p>
            <button className="mt-4 text-indigo-600 font-medium">
              View Story →
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCrafts;