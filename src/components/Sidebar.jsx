import React, { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } lg:block lg:w-64 w-64 bg-icbackground text-icbackgroundlight min-h-screen p-4 transition-all z-50 ease-in-out duration-1000 flex flex-col`}
      >
        {/* Brand Name (Hidden on small screens) */}
        <div className="text-xl font-semibold mb-8 hidden lg:block">BrandName</div>

        <ul>
          <li className="mb-2 hover:bg-ictheme p-2 rounded">
            <a href="/dashboard">Dashboard</a>
          </li>
          <li className="mb-2 hover:bg-ictheme p-2 rounded">
            <a href="/brands">Brands</a>
          </li>
          <li className="mb-2 hover:bg-ictheme p-2 rounded">
            <a href="/settings">Settings</a>
          </li>
        </ul>

        {/* Name and Signout (Pushed to the bottom of the sidebar) */}
        <div className="mt-96 bg-icbackgroundcard p-4 rounded">
          <div className="mb-4 text-icbackgroundlight font-semibold">Aditya Ingale</div>
          <div className="hover:bg-icbackground hover:border-icbackgroundlight border border-ictheme bg-icbackground p-1 rounded text-center">
            <a href="/settings">Sign out</a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile Bar */}
        <div className="lg:hidden flex justify-between items-center p-4 bg-gray-800 text-white">
          <div className="text-xl font-semibold">BrandName</div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-xl focus:outline-none"
          >
            &#9776;
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Your main content here */}
          <h1>Main Content Area</h1>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
