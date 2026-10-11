import type { NextApiRequest, NextApiResponse } from "next";
import { getAllProducts } from "@/lib/products";
import { methodNotAllowed } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  try {
    return res.status(200).json(await getAllProducts());
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Sorry, try again later" });
  }
}
