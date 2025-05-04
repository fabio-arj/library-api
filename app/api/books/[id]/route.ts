import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: "Book ID not found" }, { status: 400 });
  }

  const book = await prisma.book.findUnique({
    where: {
      id: Number(id),
    },
  });
  return NextResponse.json(book, { status: 200 });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      title,
      author,
      published_year,
      genre,
      total_copies,
      available_copies,
    } = body;

    if (!id) {
      return NextResponse.json(
        { message: "User ID not found" },
        { status: 400 }
      );
    }

    if (
      !title ||
      !author ||
      !published_year ||
      !genre ||
      !total_copies ||
      !available_copies
    ) {
      return NextResponse.json(
        { message: "Empty mandatory fields" },
        { status: 400 }
      );
    }
    await prisma.book.update({
      where: {
        id: Number(id),
      },
      data: {
        title: title,
        author: author,
        published_year: published_year,
        genre: genre,
        total_copies: total_copies,
        available_copies: available_copies,
      },
    });

    return NextResponse.json("Book data updated!", { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating book data", error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Book ID not found" },
        { status: 400 }
      );
    }

    await prisma.book.delete({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json({ message: "Book deleted!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting book", error },
      { status: 500 }
    );
  }
}
