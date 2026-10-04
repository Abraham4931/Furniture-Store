import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const StoreLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EF] text-[#031008]">
      {/* Navigation */}
      <Navbar />

      {/* Current page */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default StoreLayout;