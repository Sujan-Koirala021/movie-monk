import React, { useState, useEffect } from 'react';
import { FileText, Menu, X } from "lucide-react";
import { Link } from 'react-router-dom';
import Logo from '../../images/logo.png'

const Navbar = ({ showMoreDetails = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header
      className={` top-0 w-full z-50 transition-all duration-300 ease-in-out min-h-16 flex justify-center md:px-24 ${scrolled
        ? 'py-5 bg-white'
        : 'py-8 bg-transparent'
        }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center">
          {/* <FileText className="h-8 w-8 text-green-600 mr-2" /> */}
          {/* <Logo/> */}
          <img src={Logo} alt="Logo Img" className='w-12 h-12 mr-2' />
          <Link to='/'><span className="text-xl font-bold tracking-tight text-gray-800">Movie<span className="text-green-600">Monk</span></span></Link>

        </div>
        <nav className="hidden md:flex items-center space-x-8">
          {showMoreDetails && (
            <>
              <a href="#features" className="text-md font-medium text-gray-700 hover:text-green-600 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-md font-medium text-gray-700 hover:text-green-600 transition-colors">
                How It Works
              </a>
              {/* <a href="#technology" className="text-md font-medium text-gray-700 hover:text-green-600 transition-colors">
                Technology
              </a> */}
            </>
          )}
          <Link to='/explore_kb' className="text-md c font-medium text-gray-700 hover:text-green-600 transition-colors">
            Explore 
          </Link>
          <Link to='/chat_agent' className="text-md c font-medium text-gray-700 hover:text-green-600 transition-colors">
            Chat Now
          </Link>
          {/* <Link to='/faq' className="text-md font-medium text-gray-700 hover:text-green-600 transition-colors">
            FAQ
          </Link> */}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link to='/screen'>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium text-md transition-colors shadow-sm">
              Get Started
            </button>
          </Link>
        </div>

        <button
          className="md:hidden text-gray-700 hover:text-green-600 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`absolute inset-0 top-[4.45rem] bg-white z-40 transform transition-transform duration-300 ease-in-out md:hidden  ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="container mx-auto px-4 py-10 flex flex-col gap-6 bg-white min-h-screen">
          {showMoreDetails && (
            <>
              <a
                href="#features"
                className="text-lg font-medium p-3 hover:bg-green-50 rounded-lg text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-lg font-medium p-3 hover:bg-green-50 rounded-lg text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#technology"
                className="text-lg font-medium p-3 hover:bg-green-50 rounded-lg text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Technology
              </a>
            </>
          )}
          <Link to='/faq'
            className="text-lg font-medium p-3 hover:bg-green-50 rounded-lg text-gray-700 hover:text-green-600 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            FAQ
          </Link>
          <Link to='/screen'
            className="text-lg font-medium p-3 hover:bg-green-50 rounded-lg text-gray-700 hover:text-green-600 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Screen
          </Link>
          <div className="flex flex-col gap-3 mt-4 ">
            <Link to='/screen'>
              <button className="w-full justify-center bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium transition-colors shadow-sm">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;