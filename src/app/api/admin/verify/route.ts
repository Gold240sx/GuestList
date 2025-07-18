import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token");

    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const decoded = verify(token.value, JWT_SECRET) as { username: string; role: string };
    
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Invalid role" }, { status: 401 });
    }

    return NextResponse.json({ 
      authenticated: true, 
      username: decoded.username 
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
} 