import dbConnect from "../../../../utils/dbConnect";
const Review = require("../../../../models/Review");
const User = require("../../../../models/User");

dbConnect();

export const getAverageReview = async (productId) => {
  const reviews = await Review.find({ productId });
  if (reviews.length < 1) {
    return 0;
  }
  // get average of rating for each product
  const average =
    reviews.reduce((accum, review) => accum + review.rating, 0) /
    reviews.length;
  return average;
};

export default async (req, res) => {
  try {
    const average = await getAverageReview(req.query.productId);
    if (!average) {
      return res.status(404).json({ message: "reviews not found" });
    }

    return res.status(200).json(average);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
