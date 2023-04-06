import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/libs/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).end();
  }

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid userId");
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const followers = await prisma.user.count({
      where: {
        follwingIds: {
          has: userId,
        },
      },
    });

    res.status(200).json({ ...existingUser, followers });
  } catch (e) {
    console.log(e);
    res.status(400).end();
  }
}
