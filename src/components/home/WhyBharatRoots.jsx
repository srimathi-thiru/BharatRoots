const features = [
  {
    title: "Living Heritage Archive",
    desc: "Digitally preserve crafts, traditions and cultural knowledge."
  },
  {
    title: "Artisan Empowerment",
    desc: "Direct platform for artisans to showcase their work."
  },
  {
    title: "Authenticity Verification",
    desc: "Verify genuine Swadeshi products using technology."
  },
  {
    title: "Ethical Marketplace",
    desc: "Support fair trade and sustainable livelihoods."
  }
];

const WhyBharatRoots = () => {
  return (
    <section className="py-20 bg-white">
      <h2 className="text-3xl font-bold text-center mb-12">
        Why BharatRoots?
      </h2>

      <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
        {features.map((item, index) => (
          <div
            key={index}
            className="p-6 rounded-xl shadow-md hover:shadow-xl
            border-t-4 border-indigo-600 transition"
          >
            <h3 className="font-semibold text-lg mb-2 text-indigo-700">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyBharatRoots;