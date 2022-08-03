import dbConnect from "../../../utils/dbConnect";
const Review = require("../../../models/Review");
const User = require("../../../models/User");
import verifyToken from "../../../utils/verifyToken";

dbConnect();

export const getDataReview = async (productId) => {
  const reviews = await Review.find({ productId }).sort([['date', -1]]);

  if (reviews.length < 1) {
    //if there are no reviews return empty values
    return { reviews: [], ratingArray: [0, 0, 0, 0, 0, 0], average: 0 };
  }
  if (!reviews) {
    return res.status(404).json({ message: "reviews not found" });
  }

  //get array of rating score for histogram
  let ratingArray = [null, 0, 0, 0, 0, 0];
  for (let i = 0; i < reviews.length; i++) {
    ratingArray[reviews[i].rating] += 1;
  }

  // get average of rating for each product
  const average =
    reviews.reduce((accum, review) => accum + review.rating, 0) /
    reviews.length;

  return { average, ratingArray, reviews };
};

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        const reviews = await getDataReview(req.query.productId);

        if (!reviews) {
          return res.status(404).json({ message: "reviews not found" });
        }

        return res.status(200).json({ reviews, ratingArray, average });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
      break;
    case "POST":
      try {
        const result = verifyToken(req);

        if (!result) {
          return res.status(403).json({ message: "User not logged in" });
        }

        const { productId, text, ratingForm, reviewAuthor } = req.body;
        const newReview = await new Review({
          productId,
          userId: result.user._id,
          reviewAuthor,
          text,
          rating: ratingForm,
        });

        await newReview.save();
        return res.status(200).json({ message: "Review added" });
      } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
      }
      break;
  }
};
