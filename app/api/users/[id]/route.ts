import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: "User ID not found" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });
  return NextResponse.json(user, { status: 200 });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, password_hash } = body;

    if (!id) {
      return NextResponse.json(
        { message: "User ID not found" },
        { status: 400 }
      );
    }

    if (!name || !email || !password_hash) {
      return NextResponse.json(
        { message: "Empty mandatory fields" },
        { status: 400 }
      );
    }
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        email: email,
        password_hash: password_hash,
      },
    });

    return NextResponse.json("User data updated!", { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating user data", error },
      { status: 500 }
    );
  }
}

export async function DELETE({ params }: { params: Promise<{ id: number }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "User ID not found" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json({ message: "User deleted!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting users", error },
      { status: 500 }
    );
  }
}
