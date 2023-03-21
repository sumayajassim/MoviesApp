// //// this should not be in the components folder.

import { AuthorizedUser } from "@/types";
import jwtDecode from "jwt-decode";
import { prisma } from "../../lib/prisma";

// //// Beautifully done. This is a great example of how to use typescript to make your code more readable. Thanks Ali.
export default async function authUser(token: string) {
  const { id }: AuthorizedUser = jwtDecode(token);

  const user = await prisma.user.findUniqueOrThrow({ where: { id } });

  return {
    id,
    isAdmin: user.role === "ADMIN",
  };
}
