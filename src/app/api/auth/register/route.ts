import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { displayName, email, password } = body;

    const response = await fetch(`${process.env.API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ displayName, email, password }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Registration failed" }));
      return NextResponse.json(
        { message: errorData.message || "Registration failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { message: "Network error - API server may be offline" },
      { status: 500 }
    );
  }
}
