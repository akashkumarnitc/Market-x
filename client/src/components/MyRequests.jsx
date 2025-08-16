import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchBuyerRequests, cancelRequest } from "../features/requests/requestsSlice"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function MyRequests() {
  const dispatch = useDispatch()
  const { buyerRequests, loading } = useSelector((state) => state.requests)

  useEffect(() => {
    dispatch(fetchBuyerRequests())
  }, [dispatch])

  const handleCancel = (id) => {
    dispatch(cancelRequest(id))
      .unwrap()
      .then(() => {
        toast.success("Request cancelled successfully")
      })
      .catch(() => {
        toast.error("Failed to cancel request")
      })
  }

  return (
    <div>
      <h2>My Requests</h2>
      {loading && <p>Loading...</p>}
      {buyerRequests.map((req) => (
        <div key={req._id} className="request-card">
          <h4>{req.productId.name}</h4>
          <p>Price: ₹{req.productId.price}</p>
          <p>Status: {req.status}</p>

          {req.status === "Pending" && (
            <button onClick={() => handleCancel(req._id)}>Cancel</button>
          )}
        </div>
      ))}
      <ToastContainer />
    </div>
  )
}