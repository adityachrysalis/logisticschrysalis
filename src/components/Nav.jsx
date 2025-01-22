import React, { useState } from 'react';
import ArrowRight from '../assets/icons/arrow-right.svg';
import { Link } from 'react-router-dom';

const Nav = () => {
  const BrandName = import.meta.env.VITE_BRAND_NAME;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 bg-icbackground shadow-sm z-50">
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold">
            <Link to={'/'} className="text-ictext font-poppins">{BrandName}</Link>
          </div>

          {/* Menu Links (Desktop) */}
         

          {/* Contact Info */}
          <Link to="/login">
            <div className="hidden md:flex space-x-6 items-center">
              <div className="text-ictext bg-icbackgroundcard p-2 px-6 rounded-lg font-medium hover:border-ictheme border-2 border-icbackgroundcard flex items-center">
              Login
              <img
                    src={ArrowRight}
                    alt="ArrowRight"
                    className="w-5 h-5 ml-2"
                  />
              </div>
            </div>
          </Link>

          
          {/* Hamburger Menu (Mobile) */}
          <button
            className="md:hidden text-ictext focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mt-4 space-y-4 md:hidden">
           
           <Link to="/login">
            {/* Contact Info */}
            <div className='py-5'>

              <div className="text-icbackgroundcard my-3 bg-icbackgroundlight p-2 rounded-lg font-medium hover:border-ictheme border-2 border-icbackgroundcard flex items-center">
                Login
                <img
                  src={ArrowRight}
                  alt="Arrow-Login"
                  className="w-5 h-5 ml-2"
                />
              </div>
            </div>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
