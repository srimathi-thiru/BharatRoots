const Footer = () => {
  return (
    <footer className="w-full bg-[#0B1C35] text-white py-10">
      <div className="text-center">
        <h3 className="text-xl font-bold text-blue-400 mb-2">
          BharatRoots
        </h3>
        <p className="text-sm">
          Preserving India’s Swadeshi Heritage Digitally
        </p>
        <p className="text-xs mt-4">
          © {new Date().getFullYear()} BharatRoots. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;