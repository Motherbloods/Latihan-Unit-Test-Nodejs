const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: String,
  inStock: { type: Boolean, default: true },
});

productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
