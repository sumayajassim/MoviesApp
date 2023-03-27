import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const Secret = process.env.SECRET_KEY;

export default async function authUser(token: string) {
  const id: any = jwt.verify(token, Secret as string);

  const user = await prisma.user.findUniqueOrThrow({ where: { id } });

  return {
    id,
    isAdmin: user.role === "ADMIN",
  };
}
