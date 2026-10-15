import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import { verifyToken } from "@/utils/auth";
import { profileSchema } from "@/utils/schemas";
import { methodNotAllowed, parseBody } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") return methodNotAllowed(res, ["PUT"]);
  const token = verifyToken(req);
  if (!token) {
    return res.status(401).json({ message: "User not logged in" });
  }
  const body = parseBody(profileSchema, req, res);
  if (!body) return;

  try {
    await dbConnect();
    const user = await User.findByIdAndUpdate(
      token.id,
      {
        name: body.name,
        address: body.address,
        city: body.city,
        postcode: body.postcode,
        // date-only strings parse as utc midnight, so no time is stored
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
      },
      { returnDocument: "after", runValidators: true },
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Sorry, try again later" });
  }
}
