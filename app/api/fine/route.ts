import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const fines = await prisma.fine.findMany();
  return NextResponse.json(fines);
}

export async function POST() {
  //TODO
}
