import React from 'react'
import Layout from './Layout'
function AddProduct() {
  return (
    <>
      <Layout>
        <div className="max-w-xl mx-auto mt-10 bg-white border shadow-md rounded-lg p-6">
          <h2 className="text-2xl text-black font-semibold mb-4">Add New Product</h2>
          <form className="space-y-4">
            <div>
              <label className="block mb-1 text-black font-medium">Product Name</label>
              <input type="text" name="name" className="w-full text-black border rounded px-3 py-2" placeholder="Enter product name" />
            </div>
            <div>
              <label className="block mb-1 text-black font-medium">Description</label>
              <textarea name="description" className="w-full border text-black rounded px-3 py-2" rows="4" placeholder="Describe your product..."></textarea>
            </div>
            <div>
              <label className="block mb-1 text-black font-medium">Price (in ₹)</label>
              <input type="number" name="price" className="w-full border rounded px-3 py-2 text-black" placeholder="6000" />
            </div>
            <div>
              <label className="block mb-1 text-black font-medium">Category</label>
              <select name="category" className="w-full border text-black rounded px-3 py-2">
                <option value="">Select category</option>
                <option value="electronics">Electronics</option>
                <option value="books">Books</option>
                <option value="furniture">Furniture</option>
                <option value="fashion">Fashion</option>
                <option value="others">Others</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-black font-medium">Image URL</label>
              <input type="text" name="imageUrl" className="w-full border rounded text-black px-3 py-2" placeholder="https://..." />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Submit</button>
          </form>
        </div>
      </Layout>
    </>
  )
}

export default AddProduct