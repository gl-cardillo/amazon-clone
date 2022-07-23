const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  userId: { type: String },
  productId: { type: String },
  rate: { type: Number },
  text: { type: String },
  date: { type: Date, default: Date.now },
  reviewAuthor: { type: String },
  rating : {type: Number}
});

module.exports =
  mongoose.models.Review || mongoose.model("Review", ReviewSchema);
