import Layout from "../components/Layout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProducts } from "../features/products/productsSlice";
import { fetchBuyerRequests, createRequest, cancelRequest } from "../features/requests/requestsSlice";
const Cart = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);

  const { myProducts, loading: cartLoading, error: cartError } = useSelector(state => state.product);
  const { pending, loading: pendingLoading, error: pendingError } = useSelector(state => state.requests);

  useEffect(() => {
    if (user?.token) {
      dispatch(getUserProducts());
      dispatch(fetchBuyerRequests());
    }
  }, [user, dispatch]);

  const handleRequest = (product) => {
    dispatch(createRequest({ productId: product._id, quantity: 1 })); // default quantity 1
  };

  const handleCancel = (requestId) => {
    dispatch(cancelRequest(requestId));
  };

  if (cartLoading || pendingLoading) return <p>Loading...</p>;

  if (cartError) return <p>Error loading cart items: {cartError}</p>;
  if (pendingError) return <p>Error loading pending requests: {pendingError}</p>;

  return (
    <Layout>
      <div className="flex justify-center items-start w-full p-4">
        <div className="flex flex-col md:flex-row gap-6 w-4/5">
          {/* Cart Items Card */}
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md flex-1">
            <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
            {myProducts?.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <ul>
                {myProducts?.map(item => (
                  <li key={item._id} className="mb-2">
                    {item.name} - Quantity: {item.quantity || 1}{" "}
                    <button
                      onClick={() => handleRequest(item)}
                      className="ml-2 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Request Purchase
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pending Requests Card */}
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md flex-1">
            <h2 className="text-xl font-semibold mb-4">Pending Purchase Requests</h2>
            {pending?.length === 0 ? (
              <p>No pending requests.</p>
            ) : (
              <ul>
                {pending?.map(req => (
                  <li key={req._id} className="mb-2">
                    {req.productName} - Quantity: {req.quantity}{" "}
                    <button
                      onClick={() => handleCancel(req._id)}
                      className="ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;