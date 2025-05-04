import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { assertRole, getCurrentSession } from "@/lib/session";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { user } = await getCurrentSession();
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: "User ID not found" }, { status: 400 });
  }
  try {
    assertRole(user, ["BIBLIOTECARIO"]);
    const newUser = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json(newUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error getting user data", error },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { name, email, password_hash } = body;
  const { user } = await getCurrentSession();

  if (!id) {
    return NextResponse.json({ message: "User ID not found" }, { status: 400 });
  }

  if (!name || !email || !password_hash) {
    return NextResponse.json(
      { message: "Empty mandatory fields" },
      { status: 400 }
    );
  }

  try {
    assertRole(user, ["BIBLIOTECARIO"]);
    await prisma.user.update({
      where: {
        id: Number(id),
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  const { user } = await getCurrentSession();

  if (!id) {
    return NextResponse.json({ message: "User ID not found" }, { status: 400 });
  }

  try {
    assertRole(user, ["BIBLIOTECARIO"]);
    await prisma.user.delete({
      where: {
        id: Number(id),
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
