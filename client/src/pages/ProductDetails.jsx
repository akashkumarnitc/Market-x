import React from 'react';
import { useParams } from 'react-router-dom';
import dummyProducts from '../data/dummyProducts';
import Layout from '../components/Layout';

function ProductDetails() {
  const { id } = useParams();
  const product = dummyProducts.find(p => p._id === id);

  if (!product) {
    return <Layout><p className="text-red-600">Product not found</p></Layout>;
  }

  return (
    <Layout>
  <div className="flex flex-col lg:flex-row bg-white shadow-sm rounded-lg overflow-hidden h-full">
    <div className="lg:w-1/2 w-full">
      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
    </div>
    <div className="lg:w-1/2 w-full p-6 flex flex-col justify-start">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Product Details</h2>
      <h3 className="text-3xl font-semibold text-black">{product.name}</h3>
      <p className="font-semibold text-blue-600 mt-2">{product.description}</p>

      <p className="text-2xl font-semibold text-blue-600 mt-2">Rs.{product.price}</p>
      <div className="mt-3">
        <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-400">
          {product.status}
        </div>
        <div className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium border border-orange-400">
          {product.category}
        </div>
      </div>
      <div className="mt-6">
        <button className="btn btn-primary">Make Request</button>
      </div>
    </div>
  </div>
    </Layout>
  );
}

export default ProductDetails;