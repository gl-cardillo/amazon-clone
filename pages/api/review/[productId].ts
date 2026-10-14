import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import { verifyToken } from "@/utils/auth";
import { reviewRequestSchema } from "@/utils/schemas";
import { getProductById } from "@/lib/products";
import { createReview, hasReviewed } from "@/lib/reviews";
import {
  isDuplicateKeyError,
  methodNotAllowed,
  parseBody,
} from "@/lib/api";

const ALREADY_REVIEWED = "You already reviewed this product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const productId = String(req.query.productId);

  if (req.method === "POST") {
    const token = verifyToken(req);
    if (!token) {
      return res.status(401).json({ message: "User not logged in" });
    }
    const body = parseBody(reviewRequestSchema, req, res);
    if (!body) return;

    try {
      await dbConnect();
      const user = await User.findById(token.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!(await getProductById(productId))) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (await hasReviewed(user.id, productId)) {
        return res.status(409).json({ message: ALREADY_REVIEWED });
      }
      // author comes from the account, not from the request
      await createReview({
        productId,
        userId: user.id,
        reviewAuthor: user.name,
        text: body.review,
        rating: body.rating,
      });
      return res.status(200).json({ message: "Review added" });
    } catch (error) {
      // the unique index catches two posts racing the check above
      if (isDuplicateKeyError(error)) {
        return res.status(409).json({ message: ALREADY_REVIEWED });
      }
      console.error(error);
      return res.status(500).json({ message: "Sorry, try again later" });
    }
  }

  return methodNotAllowed(res, ["POST"]);
}
