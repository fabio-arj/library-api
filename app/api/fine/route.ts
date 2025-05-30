import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { assertRole, getCurrentSession } from "@/lib/session";

export async function GET() {
  const { user } = await getCurrentSession();
  assertRole(user, ["BIBLIOTECARIO"]);

  try {
    const loans = await prisma.fine.findMany();
    return Response.json(loans);
  } catch (error) {
    return NextResponse.json(
      { message: "Error getting fines", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { user } = await getCurrentSession();
  assertRole(user, ["BIBLIOTECARIO"]);

  const body = await req.json();
  const { userId, loanId, amount } = body;

  if (!userId || !loanId || !amount) {
    return NextResponse.json(
      { message: "Empty mandatory fields" },
      { status: 400 }
    );
  }

  try {
    await prisma.fine.create({
      data: {
        userId: userId,
        loanId: loanId,
        amount: amount,
      },
    });

    return NextResponse.json("Fine create!", { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating fine", error },
      { status: 500 }
    );
  }
}
