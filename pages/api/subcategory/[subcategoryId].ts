import type { NextApiRequest, NextApiResponse } from "next";
import { getProductsBySubcategory } from "@/lib/products";
import { methodNotAllowed } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  try {
    const products = await getProductsBySubcategory(
      String(req.query.subcategoryId)
    );
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Sorry, try again later" });
  }
}
