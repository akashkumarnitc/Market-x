import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard'
import Signin from '../components/Signin';
import { Link } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';

const Home = ()=> {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch products
    axiosInstance.get("/product/all")
      .then((res) => {
        setProducts(res.data.products);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
        setLoading(false);
      });

    // Check user login status
    axiosInstance.get("/user/check")
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  return (
        <Layout>
          <div className='bg-gradient-to-r from-purple-100 via-blue-100 to-pink-100'>
            <div className="hero bg-gradient-to-r from-purple-100 via-blue-100 to-pink-100 py-12">
            <div className="hero-content flex-col items-center text-center">

              <div>
                <h1 className="text-transparent bg-gradient-to-r from-pink-400 via-blue-600 to-blue-800 bg-clip-text">
                     Welcome to Market-X
                </h1>
                <p className="text-sm text-black mt-2">
                  A modern marketplace to explore, list, and purchase products with ease and efficiency.
                </p>

                <div className="mt-6 flex justify-center">
                  {!user && (
                    <Link to="/signup"> 
                      <button className="btn btn-primary">Get Started</button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
            {loading ? (
              <p className="text-center col-span-full text-blue-600">Loading products...</p>
            ) : error ? (
              <p className="text-center col-span-full text-red-600">{error}</p>
            ) : products.length === 0 ? (
              <p className="text-center col-span-full text-gray-600">No products available</p>
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  description={product.description}
                />
              ))
            )}
          </div>
        </Layout>
  );
};

export default Home;