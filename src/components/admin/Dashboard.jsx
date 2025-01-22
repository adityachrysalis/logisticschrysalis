import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import DashboardIcon from "../../assets/icons/dashboard.svg";
import SettingsIcon from "../../assets/icons/settings.svg";
import BrandsIcon from "../../assets/icons/brandsdash.svg";

function Dashboard() {
  const BrandName = import.meta.env.VITE_BRAND_NAME || "DefaultBrandName";
  const [isOpen, setIsOpen] = useState(false);

  const adminName = localStorage.getItem('username');

  const handleSignOut = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/"; 
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } lg:block lg:w-60 bg-icbackground text-icbackgroundlight p-4 transition-all ease-in-out duration-500 flex flex-col` }
        style={{ height: 'calc(100vh)', position: "fixed" }} >
        <div className="text-2xl font-semibold mb-10 hidden lg:block">
          {BrandName}
        </div>

        <ul>
          <Link to="/dashboard">
            <li className="mb-2 hover:bg-ictheme p-2 rounded flex items-center gap-3">
                <img src={DashboardIcon} alt={`DashboardIcon Icon`} className="w-5 h-5" /> Dashboard
            </li>
          </Link>
          <Link to="/dashboard/brands">
            <li className="mb-2 hover:bg-ictheme p-2 rounded flex items-center gap-3">
                <img src={BrandsIcon} alt={`BrandsIcon Icon`} className="w-5 h-5" /> Brands
            </li>
          </Link>
          <Link to="/dashboard/settings">
            <li className="mb-2 hover:bg-ictheme p-2 rounded flex items-center gap-3">
                <img src={SettingsIcon} alt={`SettingsIcon Icon`} className="w-5 h-5" /> Settings
            </li>
          </Link>
        </ul>

        <div className="mt-96 bg-icbackgroundcard p-4 rounded">
          <div className="mb-4 text-icbackgroundlight font-semibold">{adminName}</div>
          <button
            onClick={handleSignOut}
            className="hover:bg-icbackground hover:border-icbackgroundlight border border-ictheme bg-icbackground p-1 rounded text-center w-full"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile Bar */}
        <div className="lg:hidden flex justify-between items-center p-2 m-2 rounded-lg text-white">
          <div className="text-xl font-semibold">{BrandName}</div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-xl focus:outline-none"
          >
            &#9776;
          </button>
        </div>

        {/* Content */}
        <div className="p-5 bg-icbackgroundlight overflow-y-auto lg:ml-60" style={{ height: 'calc(100vh)' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
