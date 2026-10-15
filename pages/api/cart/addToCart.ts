import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import { verifyToken } from "@/utils/auth";
import {
  addToCartSchema,
  removeFromCartSchema,
  updateCartSchema,
} from "@/utils/schemas";
import { getProductById } from "@/lib/products";
import { methodNotAllowed, parseBody } from "@/lib/api";
import { MAX_CART_QUANTITY } from "@/utils/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!["POST", "PUT", "DELETE"].includes(req.method ?? "")) {
    return methodNotAllowed(res, ["POST", "PUT", "DELETE"]);
  }
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

    if (req.method === "POST") {
      const body = parseBody(addToCartSchema, req, res);
      if (!body) return;
      if (!(await getProductById(body.productId))) {
        return res.status(404).json({ message: "Product not found" });
      }
      const item = user.cart.find((i) => i.productId === body.productId);
      if (!item) {
        user.cart.push({ productId: body.productId, quantity: body.quantity });
      } else {
        item.quantity = Math.min(
          item.quantity + body.quantity,
          MAX_CART_QUANTITY,
        );
      }
    }

    if (req.method === "PUT") {
      const body = parseBody(updateCartSchema, req, res);
      if (!body) return;
      const item = user.cart.find((i) => i.productId === body.productId);
      if (!item) {
        return res.status(404).json({ message: "Product not in cart" });
      }
      const quantity = item.quantity + (body.n === "+1" ? 1 : -1);
      if (quantity < 1 || quantity > MAX_CART_QUANTITY) {
        return res.status(400).json({ message: "The limit is 9" });
      }
      item.quantity = quantity;
    }

    if (req.method === "DELETE") {
      const body = parseBody(removeFromCartSchema, req, res);
      if (!body) return;
      // pull() matches on _id, which cart items don't have
      const index = user.cart.findIndex((i) => i.productId === body.productId);
      if (index !== -1) user.cart.splice(index, 1);
    }

    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Sorry, try again later" });
  }
}
