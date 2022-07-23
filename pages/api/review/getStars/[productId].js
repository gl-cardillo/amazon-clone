import dbConnect from "../../../../utils/dbConnect";
const Review = require("../../../../models/Review");
const User = require("../../../../models/User");
import verifyToken from "../../../../utils/verifyToken";

dbConnect();
export default async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.query.productId });
    if (reviews.length < 1) {
      return res.status(200).json(0);
    }
    if (!reviews) {
      return res.status(404).json({ message: "reviews not found" });
    }
    const reviewsWithRating = reviews.filter(
      (review) => review.rating !== null
    );

    const rating =
      reviewsWithRating.reduce((accum, review) => accum + review.rating, 0) /
      reviewsWithRating.length;
    console.log(rating);
    return res.status(200).json(rating);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
