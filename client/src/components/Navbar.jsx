import React, { useState, useEffect } from 'react'

function Navbar({ showFilters, setShowFilters }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    // Replace with real login check logic
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  return (
    <>

<nav className="bg-white border-gray-200 dark:bg-gray-900 px-4 py-3">
  <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-x-4 flex-wrap">
    {/* Logo */}
    <a href="/" className="flex items-center space-x-3">
      <img src="/assets/app_logo.jpg" className="h-8 rounded-full" alt="Logo" />
      <span className="text-transparent bg-gradient-to-r from-pink-400 via-blue-600 to-blue-800 bg-clip-text font-bold text-lg">Market-X</span>
    </a>

    {/* Search & Filter */}
    <div className="flex items-center gap-x-2 flex-grow max-w-xl">
      <input
        type="text"
        placeholder="Search for products, brands and more..."
        className="w-full px-4 py-1.5 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white-800"
      />
      <button className="px-4 py-1.5 bg-blue-600  text-white rounded-r-md hover:bg-white-700 font-medium">Search</button>
      <button
        onClick={() => setShowFilters(prev => !prev)}
        className="px-3 py-1.5 text-sm rounded-full bg-indigo-500 text-white hover:bg-indigo-600"
      >
        Filter
      </button>
    </div>

    {/* Nav Links */}
    <ul className="flex items-center space-x-4 font-medium text-gray-900 dark:text-white ml-4">
      <li><a href="/" className="hover:text-blue-600">Home</a></li>

      {isLoggedIn && (
        <>
          <li><a href="/sell" className="hover:text-blue-600">Sell</a></li>
          <li><a href="/requests" className="hover:text-blue-600 relative">Requests<span className="absolute -top-2 -right-3 text-xs font-bold bg-red-500 text-white rounded-full px-1">12</span></a></li>
          <li><a href="/cart" className="hover:text-blue-600">Cart</a></li>
        </>
      )}
    </ul>

    {/* Profile/Login */}
    <div>
      {isLoggedIn ? (
        <div className="relative">
          <button
            onClick={() => setShowDrawer(!showDrawer)}
            className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          >
            <img className="w-8 h-8 rounded-full" src="./src/assets/profile1.jpeg" alt="user" />
          </button>
          {showDrawer && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-50">
              <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Profile</a>
              <a href="/change-password" className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Change Password</a>
              <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>
              <a href="/logout" className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Logout</a>
            </div>
          )}
        </div>
      ) : (
        <a href="/login" className="text-white bg-blue-200 hover:bg-blue-00 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Login</a>
      )}
    </div>
  </div>
</nav>

    </>
  )
}

export default Navbar