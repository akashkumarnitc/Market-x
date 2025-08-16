// src/redux/slices/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance"; // Axios instance with baseURL & interceptors

// ----------------------
// Thunks for API Calls
// ----------------------

// Create Product
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/product/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Something went wrong" });
    }
  }
);

// Get All Products
export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async ({ search = "", category = "" } = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/product/all?search=${search}&category=${category}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Something went wrong" });
    }
  }
);

// Get User's Products
export const getUserProducts = createAsyncThunk(
  "product/getUserProducts",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().user.token;
      const res = await axiosInstance.get("/product/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Something went wrong" });
    }
  }
);

// Get Product by ID
export const getProductById = createAsyncThunk(
  "product/getProductById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/product/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Something went wrong" });
    }
  }
);

// Update Product
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Something went wrong" });
    }
  }
);

// Update Product Status
export const updateProductStatus = createAsyncThunk(
  "product/updateProductStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/product/${id}/status`, { status });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Something went wrong" });
    }
  }
);

// ----------------------
// Slice
// ----------------------
const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    myProducts: [],
    selectedProduct: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Create Product
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.products.unshift(action.payload.newProduct); // Add new product to list
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create product";
      });

    // Get All Products
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch products";
      });

    // Get User Products
    builder
      .addCase(getUserProducts.fulfilled, (state, action) => {
        state.myProducts = action.payload.products;
      });

    // Get Product by ID
    builder
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload.product || action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch product";
      });

    // Update Product
    builder
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        const index = state.products.findIndex(
          (p) => p._id === action.payload.product._id
        );
        if (index !== -1) state.products[index] = action.payload.product;
      });

    // Update Product Status
    builder
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        const index = state.products.findIndex(
          (p) => p._id === action.payload.product._id
        );
        if (index !== -1) state.products[index] = action.payload.product;
      });
  },
});

export const { clearMessages } = productSlice.actions;
export default productSlice.reducer;