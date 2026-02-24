import Login from "./Login";

const ArtisanLogin = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F7F4]">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Artisan Login
        </h2>
        <Login expectedRole="ARTISAN" />
      </div>
    </div>
  );
};

export default ArtisanLogin;