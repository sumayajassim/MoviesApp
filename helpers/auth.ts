import { AuthorizedUser } from "@/types";
import jwtDecode from "jwt-decode";
<<<<<<< Updated upstream:components/helpers/auth.ts
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";

const Secret = process.env.SECRET_KEY;
=======
import { prisma } from "../lib/prisma";
>>>>>>> Stashed changes:helpers/auth.ts

export default async function authUser(token: string) {
  const id: any = jwt.verify(token, Secret);

  const user = await prisma.user.findUniqueOrThrow({ where: { id } });

  return {
    id,
    isAdmin: user.role === "ADMIN",
  };
}
