import React, { useEffect, useState } from "react";

const University= ({university}) => {
    console.log(university)
  
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center">
      <img
        src={university.logo}
        alt={university.name}
        className="w-32 h-32 object-contain mb-4"
      />
      <h2 className="text-xl font-bold text-blue-900">{university.name}</h2>
      <p className="text-sm text-gray-600">{university.location}</p>
      <a
        href={university.website}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline mt-2"
      >
        {university.website}
      </a>
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mt-4">
        <p><strong>QS Asia:</strong> {university.ranking.qs_asia}</p>
        <p><strong>QS South Asia:</strong> {university.ranking.qs_asia_southern}</p>
        <p><strong>THE Asia:</strong> {university.ranking.the_asia}</p>
        <p><strong>THE World:</strong> {university.ranking.the_world}</p>
        <p><strong>SCImago (Engineering):</strong> {university.ranking.scimago_engineering}</p>
      </div>
    </div>
  );
};

const UniversityGridPage = () => {
    const [uni, setuni]=useState([]);
    useEffect(()=>{
        fetch('./uni.json')
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            setuni(data)
    },[])
    })
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-6">
      {uni.map((university) => (
        <University key={university.id} university={university} />
      ))}
    </div>
  );
};

export default UniversityGridPage;
