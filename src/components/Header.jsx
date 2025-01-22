import React from 'react';
import ArrowRight from '../assets/icons/arrow-right.svg';
import BackgroundImage from '../assets/logistics1.jpg';
import Footer from './Footer';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="relative w-full flex flex-col" style={{ height: 'calc(90vh - 2px)' }}>
      {/* Background Image */}
      <div className="absolute top-0 left-0 w-full h-full">
        <img
          src={BackgroundImage}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 flex-grow flex flex-col justify-center px-10">
        <h1 className="text-3xl md:text-7xl font-bold font-poppins text-icbackgroundlight py-2">
          Optimizing Logistics for a Better Tomorrow.
        </h1>
        <h2 className="text-2xl md:text-5xl font-bold font-poppins text-icbackgroundlight py-2">
          Delivering Efficiency, Driving Success.
        </h2>

        <Link to={'/login'} className="hidden md:flex justify-center items-center mt-5">
          <div className="text-ictext bg-icbackgroundcard p-2 px-6 w-80 h-30 rounded-lg font-medium hover:border-ictheme border-2 border-icbackgroundcard flex items-center justify-center">
            Login
            <img
              src={ArrowRight}
              alt="ArrowRight"
              className="w-8 h-8 ml-2"
            />
          </div>
        </Link>
        
        <Link to={'/login'} className="md:hidden justify-center items-center mt-5">
          <div className="text-ictext bg-icbackgroundcard p-2 px-6 w-50 h-30 rounded-lg font-medium hover:border-ictheme border-2 border-icbackgroundcard flex items-center justify-center">
            Login
            <img
              src={ArrowRight}
              alt="ArrowRight"
              className="w-8 h-8 ml-2"
            />
          </div>
        </Link>

      </div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </header>
  );
};

export default Header;
