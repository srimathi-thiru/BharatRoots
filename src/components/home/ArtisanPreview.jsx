const artisans = [
  { name: "Lakshmi Devi", craft: "Silk Weaver", village: "Kanchipuram" },
  { name: "Ramesh Kumar", craft: "Pottery", village: "Jaipur" },
  { name: "Sita Devi", craft: "Madhubani Artist", village: "Mithila" }
];

const ArtisanPreview = () => {
  return (
    <section className="py-20 bg-white">
      <h2 className="text-3xl font-bold text-center mb-12">
        Meet Our Artisans
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6">
        {artisans.map((artisan, index) => (
          <div
            key={index}
            className="text-center p-6 rounded-xl shadow hover:shadow-xl transition"
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-indigo-600 mb-4"></div>
            <h3 className="font-semibold text-lg">
              {artisan.name}
            </h3>
            <p className="text-sm text-gray-600">
              {artisan.craft}
            </p>
            <p className="text-xs text-gray-500">
              {artisan.village}
            </p>
          </div>
        ))}
      </div>

      <p className="text-center mt-8 text-gray-600">
        Supporting 100+ artisan families across India
      </p>
    </section>
  );
};

export default ArtisanPreview;