import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import { verifyToken } from "@/utils/auth";
import { getProductsById } from "@/lib/products";
import { methodNotAllowed } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  const token = verifyToken(req);
  if (!token) {
    return res.status(401).json({ message: "User not logged in" });
  }

  try {
    await dbConnect();
    const user = await User.findById(token.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const products = await getProductsById(
      user.cart.map((item) => item.productId)
    );
    const byId = new Map(products.map((product) => [product.id, product]));
    // keep the cart order and skip products that no longer exist
    const cart = user.cart.flatMap((item) => {
      const product = byId.get(item.productId);
      return product ? [{ product, quantity: item.quantity }] : [];
    });
    return res.status(200).json({ cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Sorry, try again later" });
  }
}
