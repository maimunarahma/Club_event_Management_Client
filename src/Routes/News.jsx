import axios from 'axios';
import React, { useEffect } from 'react';

const News = () => {
    const [news, setNews] = React.useState([]);
    useEffect(()=>{
        axios.get('https://club-event-management-server.onrender.com/news')
            .then(res=>{
                setNews(res.data);
            })
            .catch(err => console.error("Error fetching news:", err));
    },[])
    return (
         <div>
      <marquee behavior="scroll" direction="left" className="bg-blue-100 py-2 text-blue-800 font-medium">
        Breaking News: Admission test results have been published | National University convocation date announced | Dhaka University tech fair starts from June 10!
      </marquee>

      {news.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {news.map((item) => (
            <div key={item.id} className="bg-white shadow-lg rounded-2xl p-6 flex flex-col">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-48 object-cover mb-4 rounded-lg"
              />
              <h2 className="text-xl font-bold text-blue-900 mb-1">{item.title}</h2>
              <p className="text-sm text-gray-600 mb-2">{item.bodyOfNews}</p>

              <div className="text-xs text-gray-500 mb-2">
                Posted by {item.userEmail} on {new Date(item.datePosted).toLocaleDateString()}
              </div>

              <div className="flex justify-between text-sm text-gray-500 mt-auto">
                <span>👁️ {item.views}</span>
                <span>💬 {item.comments}</span>
                <span>👍 {item.likes}</span>
                <span>❤️ {item.love}</span>
              </div>

              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline mt-3 text-sm"
                >
                  Read more
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">No news available right now.</div>
      )}
    </div>
    );
};

export default News;