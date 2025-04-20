import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const loans = await prisma.loan.findMany();
    return Response.json(loans);
  } catch (error) {
    return NextResponse.json(
      { message: "Error getting loans", error },
      { status: 500 }
    );
  }
}
