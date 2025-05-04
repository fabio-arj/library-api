import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateSessionToken } from "@/lib/session";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get("session")?.value ?? null;

  if (request.nextUrl.pathname.startsWith("/api")) {
    if (!token) {
      return NextResponse.json(
        { message: "You need to be loged in to do this" },
        { status: 500 }
      );
    }

    const result = await validateSessionToken(token);

    if (!result.user) {
      return NextResponse.json(
        { message: "You need to be loged in to do this" },
        { status: 500 }
      );
    }
  }

  if (request.method === "GET") {
    const response = NextResponse.next();

    if (token !== null) {
      response.cookies.set("session", token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }

    return response;
  }

  const originHeader = request.headers.get("Origin");
  const hostHeader = request.headers.get("Host");

  if (originHeader === null || hostHeader === null) {
    return new NextResponse(null, { status: 403 });
  }

  let origin: URL;
  try {
    origin = new URL(originHeader);
  } catch {
    return new NextResponse(null, { status: 403 });
  }

  if (origin.host !== hostHeader) {
    return new NextResponse(null, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
