import { verifyToken } from "@/lib/auth";

export function getAuthUser(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    throw new Error("Unauthorized");
  }

  return verifyToken(token);
}