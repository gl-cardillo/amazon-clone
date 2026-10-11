import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import { signToken } from "@/utils/auth";
import { signupSchema } from "@/utils/schemas";
import { methodNotAllowed, parseBody } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  const body = parseBody(signupSchema, req, res);
  if (!body) return;

  try {
    await dbConnect();
    if (await User.exists({ email: body.email })) {
      return res.status(400).json({ message: "Email not available" });
    }
    const user = await User.create({
      name: body.name,
      email: body.email,
      password: await bcrypt.hash(body.password, 10),
      cart: [],
    });
    return res.status(200).json({ user, token: signToken(user.id) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Sorry, try again later" });
  }
}
