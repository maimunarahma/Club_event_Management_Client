import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-10">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold mb-2">CampusBeat</h2>
          <p className="text-sm text-gray-300">
            Connecting students through events, clubs, and community.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-gray-300 text-sm">
            <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
            <li><a href="/events" className="hover:underline">Events</a></li>
            <li><a href="/clubs" className="hover:underline">Clubs</a></li>
            <li><a href="/profile" className="hover:underline">My Profile</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex gap-4 text-2xl text-gray-300">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <FaFacebook className="hover:text-white" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram className="hover:text-white" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <FaLinkedin className="hover:text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="bg-gray-900 text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} ClubSphere. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
