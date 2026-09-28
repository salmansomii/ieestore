import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <Helmet>
        <title>404 - Page Not Found | IEE Store</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Helmet>
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        We're sorry, but the page you were looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
