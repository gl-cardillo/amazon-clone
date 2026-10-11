import type { NextApiRequest, NextApiResponse } from "next";
import { getProductById } from "@/lib/products";
import { methodNotAllowed } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  try {
    const product = await getProductById(String(req.query.productId));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Sorry, try again later" });
  }
}
