import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Filters from './Filters'; // this is the component

const Layout = ({ children }) => {
  const [showFilters, setShowFilters] = useState(false); // renamed state

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-r from-purple-100 via-blue-100 to-pink-100">
      <div className="sticky top-0 z-50">
        <Navbar showFilters={showFilters} setShowFilters={setShowFilters} />
      </div>
      <div>
        <Filters show={showFilters} onClose={() => setShowFilters(false)} />
      </div>

      {/* Filters Panel */}
      {showFilters && <Filters onClose={() => setShowFilters(false)} />}

      <main className="flex-grow p-6 bg-gray-100 bg-gradient-to-r from-purple-100 via-blue-100 to-pink-100">
        {children}
      </main>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;