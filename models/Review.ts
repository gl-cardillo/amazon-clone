import mongoose, { type InferSchemaType, type Model } from "mongoose";
import { DateTime } from "luxon";

// destructured so plain node scripts can import the models too
const { Schema, model, models } = mongoose;

const reviewSchema = new Schema(
  {
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
    reviewAuthor: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

reviewSchema.index({ productId: 1 });
// one review per user and product
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

reviewSchema.virtual("date_formatted").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_FULL);
});

export type ReviewDocument = InferSchemaType<typeof reviewSchema>;

const Review =
  (models.Review as Model<ReviewDocument> | undefined) ??
  model<ReviewDocument>("Review", reviewSchema);

export default Review;
