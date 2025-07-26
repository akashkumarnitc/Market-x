import React from 'react';

function Filters({ show, onClose }) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-blue-200 via-slate-200 to-indigo-100 text-black shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
        show ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button className="text-gray-500 hover:text-black text-xl" onClick={onClose}>×</button>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <label className="font-medium">Category</label>
          <div className="flex flex-col space-y-1 mt-2">
            <label><input type="checkbox" className="mr-2" /> Electronics</label>
            <label><input type="checkbox" className="mr-2" /> Fashion</label>
            <label><input type="checkbox" className="mr-2" /> Home Appliances</label>
          </div>
        </div>

        <div className="mb-4">
          <label className="font-medium">Price</label>
          <div className="flex flex-col space-y-1 mt-2">
            <label><input type="checkbox" className="mr-2" /> ₹0 - ₹1000</label>
            <label><input type="checkbox" className="mr-2" /> ₹1000 - ₹5000</label>
            <label><input type="checkbox" className="mr-2" /> ₹5000+</label>
          </div>
        </div>
        <button className='text-white'>Apply</button>
      </div>
    </div>
  );
}

export default Filters;