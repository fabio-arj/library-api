import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const loans = await prisma.loan.findMany();
  return NextResponse.json(loans);
}

export async function POST(req: NextRequest) {
  //TODO
}
