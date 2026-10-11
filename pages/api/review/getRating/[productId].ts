import type { NextApiRequest, NextApiResponse } from "next";
import { getAverageRating } from "@/lib/reviews";
import { methodNotAllowed } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  try {
    // 0 means no reviews yet, which is a valid result
    const average = await getAverageRating(String(req.query.productId));
    return res.status(200).json(average);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Sorry, try again later" });
  }
}
