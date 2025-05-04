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
    return NextResponse.json({ message: "Loan ID not found" }, { status: 400 });
  }
  try {
    const loan = await prisma.loan.findUnique({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json(loan, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error getting loan data", error },
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
  const body = await req.json();
  const { return_date } = body;

  if (!id) {
    return NextResponse.json({ message: "Loan ID not found" }, { status: 400 });
  }

  if (!return_date) {
    return NextResponse.json(
      { message: "Empty mandatory fields" },
      { status: 400 }
    );
  }

  try {
    await prisma.loan.update({
      where: {
        id: Number(id),
      },
      data: {
        return_date: return_date,
        status: "DEVOLVIDO",
      },
    });

    return NextResponse.json("Loan data updated!", { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating loan data", error },
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
    return NextResponse.json({ message: "Loan ID not found" }, { status: 400 });
  }

  try {
    await prisma.loan.delete({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json({ message: "Loan deleted!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting loan", error },
      { status: 500 }
    );
  }
}
