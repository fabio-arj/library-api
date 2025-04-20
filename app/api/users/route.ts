import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.user.findMany({
    where: { role: "CLIENTE" },
  });
  return NextResponse.json(users);
}

export async function POST() {
  //TODO
}
