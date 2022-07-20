const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String },
  price: { type: Number },
  manufacturer: { type: String },
  picUrl: { type: String },
  picUrl2: { type: String },
  picUrl3: { type: String },
  description: { type: String },
  description2: { type: String },
  description3: { type: String },
  categoryId: { type: String },
  categoryName: { type: String },
  subcategory: { type: String },
});

module.exports =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
