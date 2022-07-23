import dbConnect from "../../../utils/dbConnect";
const Review = require("../../../models/Review");
const User = require("../../../models/User");
import verifyToken from "../../../utils/verifyToken";

dbConnect();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        const reviews = await Review.find({ productId: req.query.productId });
        if (reviews.length < 1) {
          return res.status(200).json([]);
        }
        if (!reviews) {
          return res.status(404).json({ message: "reviews not found" });
        }
        return res.status(200).json(reviews);
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

        const { productId, text, rating, reviewAuthor } = req.body;
        const newReview = await new Review({
          productId,
          userId: result.user._id,
          reviewAuthor,
          text,
          rating

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
