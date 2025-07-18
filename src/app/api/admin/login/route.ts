import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sign } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Get admin credentials from environment variables
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    // Validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create JWT token
      const token = sign({ username, role: "admin" }, JWT_SECRET, {
        expiresIn: "24h",
      });

      // Set HTTP-only cookie
      const cookieStore = await cookies();
      cookieStore.set("admin-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 