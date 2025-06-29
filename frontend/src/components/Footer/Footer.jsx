import React from 'react';
import Navbar from '../Navbar/Navbar';

const Footer = () => {
  return (
    <footer className="bg-black shadow  h-24 flex justify-center items-center">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-700 sm:text-center dark:text-gray-300">© 2025 MovieMonk. All Rights Reserved.</span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-700 dark:text-gray-300 sm:mt-0">
          <li>
            <a href="/screen" className="hover:underline me-4 md:me-6 text-green-600 dark:text-green-400">Contact</a>
          </li>
          <li>
            <a href="/about" className="hover:underline me-4 md:me-6 text-green-600 dark:text-green-400">About Us</a>
          </li>
          <li>
            <a href="/help" className="hover:underline me-4 md:me-6 text-green-600 dark:text-green-400">Support</a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
