import type { NextApiRequest } from "next";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
}

function getSecret() {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) throw new Error("ACCESS_TOKEN_SECRET is not set");
  return secret;
}

export function signToken(id: string) {
  return jwt.sign({ id } satisfies TokenPayload, getSecret(), {
    expiresIn: "7d",
  });
}

export function verifyToken(req: NextApiRequest): TokenPayload | null {
  const [scheme, token] = (req.headers.authorization ?? "").split(" ");
  if (scheme !== "Bearer" || !token) return null;
  try {
    const decoded = jwt.verify(token, getSecret());
    // old tokens carried the whole user instead of an id, reject them
    if (typeof decoded === "string" || typeof decoded.id !== "string") {
      return null;
    }
    return { id: decoded.id };
  } catch {
    return null;
  }
}
