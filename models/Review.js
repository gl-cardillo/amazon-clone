const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const ReviewSchema = new mongoose.Schema({
  userId: { type: String },
  productId: { type: String },
  rate: { type: Number },
  text: { type: String },
  date: { type: Date, default: Date.now },
  reviewAuthor: { type: String },
  rating : {type: Number}
});

ReviewSchema.set("toObject", { virtuals: true });
ReviewSchema.set("toJSON", { virtuals: true });

ReviewSchema.virtual("date_formatted").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(
    DateTime.DATE_FULL
  );
});


module.exports =
  mongoose.models.Review || mongoose.model("Review", ReviewSchema);
