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
    // get average of rating for each product
    const average =
      reviews.reduce((accum, review) => accum + review.rating, 0) /
      reviews.length;

    return res.status(200).json(average);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
