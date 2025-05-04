import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { assertRole, getCurrentSession } from "@/lib/session";

export async function GET() {
  const { user } = await getCurrentSession();
  assertRole(user, ["BIBLIOTECARIO"]);

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
  const body = await req.json();
  const { name, email, password_hash } = body;
  const { user } = await getCurrentSession();

  assertRole(user, ["BIBLIOTECARIO"]);

  try {
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
