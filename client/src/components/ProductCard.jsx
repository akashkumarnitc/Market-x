import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ id, name, price, imageUrl, description }) {
  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-600 dark:border-gray-700">
      <Link to={`/product/${id}`}>
        <img className="p-8 rounded-xl w-full h-48 object-cover" src={imageUrl} alt={name} />
      </Link>
      <div className="px-5 pb-5">
        <Link to={`/product/${id}`}>
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {name}
          </h5>
        </Link>
        <p className="text-gray-600 text-sm my-2">{description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{price}</span>
          <Link to={`/product/${id}`}>
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              View
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;