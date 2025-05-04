import { prisma } from "@/lib/db";
import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
  getCurrentSession,
  assertRole,
} from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";

export async function POST(req: NextRequest) {
  const curretSession = await getCurrentSession();
  assertRole(curretSession.user, ["BIBLIOTECARIO"]);

  if (curretSession.session && curretSession.user) {
    return NextResponse.json(
      { message: "There's a user loged in" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { message: "Empty mandatory fields" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await argon2.verify(user.password_hash, password);

    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);

    await setSessionTokenCookie(sessionToken, session.expires_at);

    return NextResponse.json("Login successful", { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Login error", error },
      { status: 500 }
    );
  }
}
