import { prisma } from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";

const Secret = process.env.SECRET_KEY;

if (!Secret) {
  throw new Error("Secret key Is Missing");
}

export default async function authUser(token: string) {
  const id: string = jwt.verify(token, Secret as string) as string;

  const user = await prisma.user.findUniqueOrThrow({ where: { id } });

  return {
    id,
    isAdmin: user.role === "ADMIN",
  };
}
