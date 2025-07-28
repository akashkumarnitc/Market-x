import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import axiosInstance from '../api/axiosInstance';
function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/product/${id}`)
      .then(response => {
        setProduct(response.data.product);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Product not found");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <Layout><Loading /></Layout>;
  }

  if (error) {
    return <Layout><p className="text-red-600">{error}</p></Layout>;
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
     <div className="inline-block bg-yellow-100 text-orange-800 px-3 py-1 my-2 rounded text-sm font-medium border border-orange-400">
          <p className="text-xl  text-blue-600 mt-2">Seller contact</p>
          <p className="text-blue-600 mt-2">email:{product.seller.email}</p>
          <p className="text-blue-600 mt-2">{product.seller.fullName}</p>
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