import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_KEY } from "./lib/constants";

export function middleware(request: NextRequest) {
    const token = request.cookies.get(ACCESS_TOKEN_KEY)?.value;
    if (!token) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|login|register|auth|blog/).*)'
    ]
}