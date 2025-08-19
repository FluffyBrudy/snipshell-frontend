import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const baseUrl = process.env.API_BASE_URL;
    if (!baseUrl) {
      throw new Error("API_BASE_URL is not defined in environment variables");
    }

    const cookie = request.headers.get("cookie") || "";
    console.log(cookie);

    const response = await fetch(`${baseUrl}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookie
      },
      body: JSON.stringify({})
    });
    console.log(response);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Refresh token failed" }));
      return NextResponse.json(
        { message: errorData.message || "Refresh token failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Refresh token API error:", error);
    return NextResponse.json(
      { message: "Network error - API server may be offline" },
      { status: 500 }
    );
  }
}


