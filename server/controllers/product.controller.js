import Product from "../models/product.model.js";
import PurchaseRequest from "../models/purchaseRequest.model.js";
import getDataUri from "../config/dataURI.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";

// @desc     Creating/Posting a product
// @route    POST /api/product/create
// @access   Private
export const createProduct = async (req, res) => {
  const { name, description, price, category } = req.body;
  const file = req.file;
  try {
    // validate data
    if (!name || !description || !price || !category) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // habdle the image file
    let cloudResponse = "";
    if (file) {
      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      imageUrl: cloudResponse.secure_url,
      seller: req.id,
      status: "Available",
    });

    return res.status(201).json({
      message: "Product created successfully",
      success: true,
      newProduct,
    });
  } catch (error) {
    console.log("Error in createProduct controller. ", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// @desc     Get all available products
// @route    GET /api/product/all
// @access   Public
export const getAllProducts = async (req, res) => {
  const { search = "", category = "" } = req.query;

  try {
    // Build dynamic filter object
    const filter = {
      status: { $ne: "Sold" }, // Exclude sold items
    };

    // Apply search keyword (case-insensitive match on name/description)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Apply category filter if provided
    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 }) // newest first
      .populate("seller", "fullName email phoneNumber profilePic"); // minimal seller info

    res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.log("Error in getAllProducts controller", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// @desc     Get all products listed by the logged-in user
// @route    GET /api/product/my
// @access   Privtate
export const getUserProducts = async (req, res) => {
  try {
    const userId = req.id;
    const products = await Product.find({ seller: userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message: "Fetched your products succesfully",
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.log("Error in getUserProducts controller.", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// @desc     Get product by its 'id'
// @route    GET /api/product/:id
// @access   Public
export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ message: "Invalid product ID", success: false });
    }

    const product = await Product.findById(productId).populate(
      "seller",
      "name email phoneNumber profilePic"
    );

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    return res.status(200).json({
      message: "Fetched product successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.log("Error in getProductById controller", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// @desc     Update product details (allowed only when status is "Available")
// @route    PUT /api/product/:id
// @access   Private
export const updateProduct = async (req, res) => {
  const { name, description, price, category } = req.body;
  const file = req.file;
  const productId = req.params.id;
  try {
    // validate 'id'
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ message: "Invalid product ID", success: false });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    // check if current user if the seller of that produtct
    if (product.seller.toString() !== req.id) {
      return res.status(403).json({
        message: "Unauthorized to update this product",
        success: false,
      });
    }

    // Allow update only if product is still Available
    if (product.status !== "Available") {
      return res.status(400).json({
        message: `Product is already ${product.status} and cannot be updated`,
        success: false,
      });
    }

    // update product
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      product.imageUrl = cloudResponse.secure_url;
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.log("Error in updateProduct controller", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// @desc     Update product status
// @route    PATCH /api/product/:id/status
// @access   Private
export const updateProductStatus = async (req, res) => {
  const productId = req.params.id;
  const { status } = req.body;
  const validStatuses = ["Available", "Reserved", "Sold"];
  try {
    // validate the product id
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ message: "Invalid product ID", success: false });
    }
    // validate status value
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status value", success: false });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }
    // ensure the current user is the seller of that product
    if (product.seller.toString() !== req.id) {
      return res.status(403).json({
        message: "Unauthorized to update the product status",
        success: false,
      });
    }

    // if the product is already sold then prevent changes
    if (product.status === "Sold" && status !== "Sold") {
      return res.status(400).json({
        message: "Product is already sold, so cannot update its status",
        success: false,
      });
    }

    // update status
    product.status = status;
    await product.save();

    return res
      .status(200)
      .json({ message: "Status updated successfully", success: true, product });
  } catch (error) {
    console.log("Error in updateProductStatus controller", error);
    res.status(500).json({ message: "Intenrnal server error", success: false });
  }
};
