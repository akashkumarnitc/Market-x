// src/redux/slices/requestsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// ------------------------
// Async Thunks
// ------------------------

// Accept request (Seller)
export const acceptRequest = createAsyncThunk(
  "requests/acceptRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/request/${requestId}/accept`);
      return res.data.acceptedRequest;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Cancel request (Buyer)
export const cancelRequest = createAsyncThunk(
  "requests/cancelRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/request/${requestId}/cancel`);
      return res.data.request;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch seller requests
export const fetchSellerRequests = createAsyncThunk(
  "requests/fetchSellerRequests",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/request/seller");
      return res.data.requests;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch buyer requests
export const fetchBuyerRequests = createAsyncThunk(
  "requests/fetchBuyerRequests",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/request/buyer");
      return res.data.myRequests;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create request (Buyer)
export const createRequest = createAsyncThunk(
  "requests/createRequest",
  async ({ productId, reqMessage, offerPrice }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/request/${productId}`, { reqMessage, offerPrice });
      return res.data.createdRequest;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ------------------------
// Slice
// ------------------------
const requestsSlice = createSlice({
  name: "requests",
  initialState: {
    sellerRequests: [],
    buyerRequests: [],
    unseenCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    markRequestsSeen: (state) => {
      state.unseenCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // ------------------------
      // Accept Request
      // ------------------------
      .addCase(acceptRequest.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(acceptRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.sellerRequests = state.sellerRequests.map((req) =>
          req._id === action.payload._id ? action.payload : req
        );
        state.unseenCount = state.sellerRequests.filter((r) => r.status === "Pending").length;
      })
      .addCase(acceptRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to accept request";
      })

      // ------------------------
      // Cancel Request
      // ------------------------
      .addCase(cancelRequest.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(cancelRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.buyerRequests = state.buyerRequests.map((req) =>
          req._id === action.payload._id ? action.payload : req
        );
      })
      .addCase(cancelRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to cancel request";
      })

      // ------------------------
      // Fetch Seller Requests
      // ------------------------
      .addCase(fetchSellerRequests.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSellerRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.sellerRequests = action.payload;
        state.unseenCount = action.payload.filter((req) => req.status === "Pending").length;
      })
      .addCase(fetchSellerRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch seller requests";
      })

      // ------------------------
      // Fetch Buyer Requests
      // ------------------------
      .addCase(fetchBuyerRequests.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBuyerRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.buyerRequests = action.payload;
      })
      .addCase(fetchBuyerRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch buyer requests";
      })

      // ------------------------
      // Create Request
      // ------------------------
      .addCase(createRequest.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.buyerRequests.unshift(action.payload);
      })
      .addCase(createRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create request";
      });
  },
});

export const { markRequestsSeen } = requestsSlice.actions;
export default requestsSlice.reducer;