import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { assertRole, getCurrentSession } from "@/lib/session";

export async function GET() {
  const { user } = await getCurrentSession();
  assertRole(user, ["BIBLIOTECARIO"]);

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

export async function POST(req: NextRequest) {
  const { user } = await getCurrentSession();
  assertRole(user, ["BIBLIOTECARIO"]);

  const body = await req.json();
  const { userId, bookId, dueDate } = body;

  if (!userId || !bookId || !dueDate) {
    return NextResponse.json(
      { message: "Empty mandatory fields" },
      { status: 400 }
    );
  }

  try {
    await prisma.loan.create({
      data: {
        userId: userId,
        bookId: bookId,
        due_date: dueDate,
      },
    });

    return NextResponse.json("Loan create!", { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating loan", error },
      { status: 500 }
    );
  }
}
