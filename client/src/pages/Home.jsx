import React from 'react'
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard'
import Signin from '../components/Signin';
import dummyProducts from '../data/dummyProducts'
import { Link } from 'react-router-dom';
const Home = ()=> {
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
                 <Link to="/signup"> 
                 <button className="btn btn-primary">Get Started</button>
                 </Link>
                </div>
              </div>
            </div>
          </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
            {dummyProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
                description={product.description}
              />
            ))}
          </div>
        </Layout>
  );
};

export default Home;