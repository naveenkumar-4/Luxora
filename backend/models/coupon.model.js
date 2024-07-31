import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  expiry: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
});

export const CouponSchema = new mongoose.model("Coupon", couponSchema);
