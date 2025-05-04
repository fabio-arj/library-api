import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { assertRole, getCurrentSession } from "@/lib/session";

export async function GET() {
  const { user } = await getCurrentSession();
  assertRole(user, ["BIBLIOTECARIO"]);

  try {
    const books = await prisma.book.findMany();
    return Response.json(books, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error getting books", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { user } = await getCurrentSession();
  assertRole(user, ["BIBLIOTECARIO"]);

  const body = await req.json();
  const {
    title,
    author,
    published_year,
    genre,
    total_copies,
    available_copies,
  } = body;

  try {
    await prisma.book.create({
      data: {
        title: title,
        author: author,
        published_year: published_year,
        genre: genre,
        total_copies: total_copies,
        available_copies: available_copies,
      },
    });

    return NextResponse.json("Book added!", { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error adding book", error },
      { status: 500 }
    );
  }
}
