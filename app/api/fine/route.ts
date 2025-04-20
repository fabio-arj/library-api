import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const fines = await prisma.fine.findMany();
    return Response.json(fines);
  } catch (error) {
    return NextResponse.json(
      { message: "Error getting fines", error },
      { status: 500 }
    );
  }
}

export async function POST() {
  //TODO
}
