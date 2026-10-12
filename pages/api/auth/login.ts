import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import { signToken } from "@/utils/auth";
import { loginRequestSchema } from "@/utils/schemas";
import { methodNotAllowed, parseBody } from "@/lib/api";
import { TEST_ACCOUNT_EMAIL } from "@/utils/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  const body = parseBody(loginRequestSchema, req, res);
  if (!body) return;

  // the test account button logs in without asking for the password
  const password =
    body.emailLogin === TEST_ACCOUNT_EMAIL
      ? process.env.TEST_PASSWORD
      : body.passwordLogin;

  try {
    await dbConnect();
    const user = await User.findOne({ email: body.emailLogin }).select(
      "+password"
    );
    // same response for unknown email and wrong password
    if (!user || !password || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Credentials are incorrect" });
    }
    return res.status(200).json({ user, token: signToken(user.id) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Sorry, try again later" });
  }
}
