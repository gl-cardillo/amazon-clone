import type { NextApiRequest, NextApiResponse } from "next";
import { searchProducts } from "@/lib/products";
import { methodNotAllowed } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  const query = typeof req.query.q === "string" ? req.query.q.trim() : "";
  if (!query) return res.status(200).json([]);
  try {
    return res.status(200).json(await searchProducts(query));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Sorry, try again later" });
  }
}
