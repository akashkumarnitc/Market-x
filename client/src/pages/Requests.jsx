import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { useSelector, useDispatch } from "react-redux";
import { getUserProducts } from "../features/products/productsSlice";



import { fetchSellerRequests, acceptRequest } from "../features/requests/requestsSlice"

function SellerRequests() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user);
  const { sellerRequests, loading, unseenCount } = useSelector((state) => state.requests)

  useEffect(() => {
    dispatch(fetchSellerRequests())
  }, [dispatch])

  const handleAccept = (id) => {
    dispatch(acceptRequest(id))
  }

  // Fetch user's products on mount
  useEffect(() => {
    if (user) {
      dispatch(getUserProducts());
    }
  }, [dispatch, user]);

  return (
    <Layout>
      <div className="flex justify-center items-center w-full">
 
      <div className="w-4/5 h-4/5 p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-600 dark:border-gray-700">
      <div className="flex-centerflex items-center justify-between mb-4">
      <h2>
        Purchase Requests {unseenCount > 0 && <span>({unseenCount} New)</span>}
      </h2>

      {loading && <p>Loading...</p>}
      {sellerRequests.length === 0 && !loading && (
        <p className="text-center text-gray-500">No purchase requests found.</p>
      )}
      {sellerRequests.map((req) => (
        <div
          key={req._id}
          className="p-4 mb-4 bg-gray-50 border rounded-lg shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center mb-2">
            <span className="font-bold text-gray-800">{req.productId.name}</span>
            {req.status === "Pending" && (
              <span className="ml-2 w-2 h-2 bg-red-500 rounded-full inline-block"></span>
            )}
          </div>
          <div className="text-sm text-gray-600 mb-1">{req.productId.description}</div>
          <div className="font-semibold text-gray-700 mb-1">
            Price: ₹{req.productId.price}
          </div>
          <div className="text-sm mb-1">
            <span className="font-semibold text-gray-700">Status:</span>{" "}
            <span className="text-gray-700">{req.status}</span>
          </div>
          <div className="text-sm text-gray-600 mb-2">
            Buyer: <span className="font-semibold text-gray-700">{req.buyerId.fullName}</span> ({req.buyerId.email})
          </div>
          {req.status === "Pending" && (
            <button
              onClick={() => handleAccept(req._id)}
              className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Accept
            </button>
          )}
        </div>
      ))}
    </div>
    </div>
    </div>
    </Layout>
  );
}

export default SellerRequests;