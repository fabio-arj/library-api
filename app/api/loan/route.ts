import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, bookId, dueDate } = body;

    if (!userId || !bookId || !dueDate) {
      return NextResponse.json(
        { message: "Empty mandatory fields" },
        { status: 400 }
      );
    }

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
