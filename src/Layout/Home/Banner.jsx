import React from "react";
import "./Banner.css";
import { Link } from "react-router-dom";
const Banner = () => {
  return (
    <section className=" text-purple-600 py-20 px-4 text-center md:text-left">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-3">
        {/* Text Area */}
        <div className="flex-1 space-y-6 md:space-y-1 md:w-full">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          CampusBeat
          </h1>
          <p className="text-xl font-medium">
            Connecting All University Events Across Bangladesh
          </p>
          <p className="text-base text-white/90">
            From championships to cultural fests — explore, register, and shine!
          </p>
          <div className="space-x-4 mt-4">
            <Link to='/event'>
             <button className="btn bg-white text-blue-900 font-semibold px-6 py-3 rounded-xl shadow hover:bg-purple-400 transition">
              🔍 Browse Events
            </button>

            </Link>
           

          </div>
        </div>

        {/* Optional Image Area */}
        <div className="flex-1">
          <img
            src="https://i.ibb.co/WJxwSg9/istockphoto-2040474149-1024x1024.jpg"
            alt="Campus Celebration"
            className="banner-img rounded-2xl shadow-lg w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Banner;
