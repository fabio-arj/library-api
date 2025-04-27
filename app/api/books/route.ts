import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
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
  try {
    const body = await req.json();
    const {
      title,
      author,
      published_year,
      genre,
      total_copies,
      available_copies,
    } = body;

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
