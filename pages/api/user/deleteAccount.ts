import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import { verifyToken } from "@/utils/auth";
import { methodNotAllowed } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") return methodNotAllowed(res, ["DELETE"]);
  const token = verifyToken(req);
  if (!token) {
    return res.status(401).json({ message: "User not logged in" });
  }

  try {
    await dbConnect();
    const deleted = await User.findByIdAndDelete(token.id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Sorry, try again later" });
  }
}
