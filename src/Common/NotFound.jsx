import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-pink-100 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-[120px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 drop-shadow-lg">
          404
        </h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Oops! Page not found.</h2>
        <p className="text-gray-600 mb-8">
          The page you’re looking for doesn’t exist or has been moved. Please check the URL or return home.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 transition duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
