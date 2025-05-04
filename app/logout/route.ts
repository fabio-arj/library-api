import {
  deleteSessionTokenCookie,
  invalidateSession,
  getCurrentSession,
} from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST() {
  const { session } = await getCurrentSession();
  if (!session) {
    return NextResponse.json(
      { message: "There's no active session" },
      { status: 500 }
    );
  }

  await invalidateSession(session.token);
  await deleteSessionTokenCookie();

  try {
    return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Logout failed" }, { status: 500 });
  }
}
