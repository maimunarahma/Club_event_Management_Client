import React from "react";
import "./Banner.css";
const Banner = () => {
  return (
    <section className=" text-purple-600 py-20 px-4 text-center md:text-left">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
        {/* Text Area */}
        <div className="flex-1 space-y-6">
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
            <button className="bg-white text-blue-900 font-semibold px-6 py-3 rounded-xl shadow hover:bg-yellow-400 transition">
              🔍 Browse Events
            </button>
<button className="transform skew-x-[-12deg] origin-top-right text-white font-semibold px-6 py-3 rounded-xl bg-gradient-to-r from-[#27005D] to-[#9400FF] hover:bg-white hover:text-blue-900 transition">
  📝 Register Club
</button>

          </div>
        </div>

        {/* Optional Image Area */}
        <div className="flex-1 hidden md:block">
          <img
            src="/campus-banner.png"
            alt="Campus Celebration"
            className="rounded-2xl shadow-lg w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Banner;
