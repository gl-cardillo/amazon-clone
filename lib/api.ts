import type { NextApiRequest, NextApiResponse } from "next";
import type { z } from "zod";
import { mongo } from "mongoose";

// sends a 400 with the first issue and returns null when the body is invalid
export function parseBody<T extends z.ZodType>(
  schema: T,
  req: NextApiRequest,
  res: NextApiResponse
): z.infer<T> | null {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: result.error.issues[0].message });
    return null;
  }
  return result.data;
}

// a write rejected by a unique index
export function isDuplicateKeyError(error: unknown) {
  return error instanceof mongo.MongoServerError && error.code === 11000;
}

export function methodNotAllowed(res: NextApiResponse, allowed: string[]) {
  res.setHeader("Allow", allowed);
  return res.status(405).json({ message: "Method not allowed" });
}
