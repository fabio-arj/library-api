import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { role: "CLIENTE" },
    });
    return Response.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error getting users", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password_hash } = body;

    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password_hash: password_hash,
      },
    });

    return NextResponse.json("User created!", { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating user", error },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await prisma.user.deleteMany({
      where: {
        role: "CLIENTE",
      },
    });
    return NextResponse.json("Users deleted!", { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting users", error },
      { status: 500 }
    );
  }
}
