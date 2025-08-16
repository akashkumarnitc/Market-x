import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { createRequest } from "../features/requests/requestsSlice";
import { getProductById } from "../features/products/productsSlice";
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import Layout from '../components/Layout';
import Loading from '../components/Loading';

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector(state => state.product.selectedProduct);
  const loading = useSelector(state => state.product.loading);
  const error = useSelector(state => state.product.error);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [reqMessage, setReqMessage] = useState('');
  const [offerPrice, setOfferPrice] = useState('');

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  const handleRequestClick = () => {
    setShowRequestForm(!showRequestForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reqMessage || !offerPrice) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await dispatch(createRequest({ productId: product._id, reqMessage, offerPrice })).unwrap();
      toast.success("Request sent successfully");
      setReqMessage('');
      setOfferPrice('');
      setShowRequestForm(false);
    } catch (err) {
      toast.error("Failed to send request");
    }
  };

  if (loading) {
    return <Layout><Loading /></Layout>;
  }

  if (error) {
    return <Layout><p className="text-red-600">{error}</p></Layout>;
  }

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
          <div className="inline-block bg-yellow-100 text-orange-800 px-3 py-1 my-2 rounded text-sm font-medium border border-orange-400">
            <p className="text-xl  text-blue-600 mt-2">Seller contact</p>
            <p className="text-blue-600 mt-2">email:{product.seller.email}</p>
            <p className="text-blue-600 mt-2">{product.seller.fullName}</p>
          </div>
          <div className="mt-6">
            <button className="btn btn-primary" onClick={handleRequestClick}>
              {showRequestForm ? "Cancel Request" : "Make Request"}
            </button>
          </div>
          {showRequestForm && (
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col space-y-4">
              <textarea
                className="border border-gray-300 text-black rounded p-2"
                placeholder="Your message"
                value={reqMessage}
                onChange={(e) => setReqMessage(e.target.value)}
                required
              />
              <input
                type="number"
                className="border border-gray-300 text-black rounded p-2"
                placeholder="Offer Price"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                required
                min="0"
              />
              <button type="submit" className="btn btn-primary">Send Request</button>
            </form>
          )}
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
}

export default ProductDetails;