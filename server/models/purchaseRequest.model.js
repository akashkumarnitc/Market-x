import mongoose from "mongoose";

const purchaseRequestSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const PurchaseRequest = mongoose.model(
  "PurchaseRequest",
  purchaseRequestSchema
);

export default PurchaseRequest;
