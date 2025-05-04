import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { assertRole, getCurrentSession } from "@/lib/session";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { user } = await getCurrentSession();
  assertRole(user, ["BIBLIOTECARIO"]);

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: "Fine ID not found" }, { status: 400 });
  }
  try {
    const fine = await prisma.fine.findUnique({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json(fine, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error getting fine" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  const { user } = await getCurrentSession();
  assertRole(user, ["BIBLIOTECARIO"]);

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: "Fine ID not found" }, { status: 400 });
  }

  try {
    await prisma.fine.update({
      where: {
        id: Number(id),
      },
      data: {
        paid: true,
      },
    });

    return NextResponse.json("Fine data updated!", { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating fine data", error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { user } = await getCurrentSession();
  assertRole(user, ["BIBLIOTECARIO"]);

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: "Fine ID not found" }, { status: 400 });
  }

  try {
    await prisma.fine.delete({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json({ message: "Fine deleted!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting fine", error },
      { status: 500 }
    );
  }
}
