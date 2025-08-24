import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    const baseUrl = process.env.API_BASE_URL;
    if (!baseUrl) {
      throw new Error("API_BASE_URL is not defined in environment variables");
    }

    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const { message } = await response.json();
      const fullErrMsg = Array.isArray(message)
        ? message.join("\n")
        : message || "Login failed";
      return NextResponse.json(
        { message: fullErrMsg },
        { status: response.status }
      );
    }
    console.log(response);
    const data = await response.json();
    const setCookie = response.headers.get("Set-Cookie");
    if (setCookie) {
      return new NextResponse(JSON.stringify(data), {
        status: response.status,
        headers: {
          "Set-Cookie": setCookie,
        },
      });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { message: "Network error - API server may be offline" },
      { status: 500 }
    );
  }
}
