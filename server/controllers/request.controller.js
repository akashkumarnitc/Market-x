import PurchaseRequest from "../models/purchaseRequest.model.js";
import Product from "../models/product.model.js";

// @desc     Buyer sends a purchase request
// @route    POST /api/request/:productId
// @access   Private (buyer only)
export const createPurchaseRequest = async (req, res) => {
  const productId = req.params.productId;
  const buyerId = req.id;

  try {
    // 1. find product
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    // 2. prevent the buyer from sending request to their own product
    if (buyerId === product.seller.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot buy your own products", success: false });
    }

    // 3. prevent duplicate requests
    const existingRequest = await PurchaseRequest.findOne({
      productId,
      buyerId,
    });
    if (existingRequest) {
      return res.status(400).json({
        message: "You have already requested this product",
        success: false,
      });
    }

    // 4. create request
    const newRequest = await PurchaseRequest.create({
      productId,
      buyerId,
      sellerId: product.seller,
    });

    return res.status(200).json({
      message: "Purchase request sent successfully.",
      success: true,
      request: newRequest,
    });
  } catch (error) {
    console.log("Error in createPurchaseRequest controller", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// @desc     Get all purchase requests received by a seller
// @route    GET /api/request/seller
// @access   Private (Seller only)
export const getRequestsForSeller = async (req, res) => {
  const sellerId = req.id;

  try {
    // fetch all requests for the current seller
    const requests = await PurchaseRequest.find({ sellerId })
      .populate("productId", "name description price category imageUrl status") // select fields from product
      .populate("buyerId", "fullName email phoneNumber profilePic") // select fields from buyer
      .sort({ createdAt: -1 }); // latest requests first

    return res
      .status(200)
      .json({ message: "Fetched all requests", success: true, requests });
  } catch (error) {
    console.log("Error in getRequestsForSeller controller", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// @desc     Accept a purchase request
// @route    PATCH /api/request/:requestId/accept
// @access   Private (Seller only)
export const acceptRequest = async (req, res) => {
  const requestId = req.params.requestId;
  const sellerId = req.id;

  try {
    // 1. find request
    const request = await PurchaseRequest.findById(requestId);
    if (!request) {
      return res
        .status(404)
        .json({ message: "Request not found", success: false });
    }

    // 2. Ensure the seller is the owner of the product
    if (sellerId !== request.sellerId.toString()) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    // 3. prevent duplicate acceptance
    if (request.status === "Accepted") {
      return res
        .status(400)
        .json({ message: "Already accepted", success: false });
    }

    // 4. Update the request to accept
    request.status = "Accepted";
    await request.save();

    // 5. reject all other requests for the same product
    await PurchaseRequest.updateMany(
      {
        productId: request.productId,
        _id: { $ne: request._id },
        status: "Pending",
      },
      { $set: { status: "Rejected" } }
    );

    // 6. update the product to reserved
    await Product.findByIdAndUpdate(request.productId, {
      status: "Reserved",
    });

    return res.status(200).json({
      message: "Request accepted successfully and product Reserved",
      success: true,
      acceptedRequest: request,
    });
  } catch (error) {
    console.log("Error in acceptRequest controller", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// @desc     Cancel a purchase request (by buyer)
// @route    PATCH /api/request/:requestId/cancel
// @access   Private (Buyer only)
export const cancelRequest = async (req, res) => {
  const requestId = req.params.requestId;
  const buyerId = req.id;

  try {
    // 1. find the request
    const request = await PurchaseRequest.findById(requestId);
    if (!request) {
      return res
        .status(404)
        .json({ message: "Request not found", success: false });
    }

    // 2. check if the request belongs to the current user
    if (request.buyerId.toString() !== buyerId) {
      return res
        .status(403)
        .json({ message: "Unauthorized access", success: false });
    }

    // 3. only cancel if request is pending
    if (request.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending requests can be cancelled",
        success: false,
      });
    }

    // 4. update request
    request.status = "Cancelled";
    await request.save();

    return res.status(200).json({
      message: "Request cancelled successfully",
      success: true,
      request,
    });
  } catch (error) {
    console.log("Error in cancelRequest controller", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// @desc     Get all purchase requests made by the logged-in buyer
// @route    GET /api/request/buyer
// @access   Private (Buyer only)
export const getMyRequests = async (req, res) => {
  const buyerId = req.id;

  try {
    const myRequests = await PurchaseRequest.find({ buyerId })
      .populate("productId", "name description price imageUrl status category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Fetched your purchase requests",
      success: true,
      myRequests,
    });
  } catch (error) {
    console.log("Error in getMyRequests controller", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
