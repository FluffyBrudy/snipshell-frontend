import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const baseUrl = process.env.API_BASE_URL;
    if (!baseUrl) {
      throw new Error("API_BASE_URL is not defined in environment variables");
    }

    const cookie = request.headers.get("cookie") || "";

    const response = await fetch(`${baseUrl}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
        Authorization: request.headers.get("Authorization") || "",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const { message } = await response.json();
      const fullErrMsg = Array.isArray(message)
        ? message.join("\n")
        : message || "Logout failed";
      return NextResponse.json(
        { message: fullErrMsg },
        { status: response.status }
      );
    }

    const setCookie = response.headers.get("Set-Cookie");
    if (setCookie) {
      return new NextResponse(
        JSON.stringify({ message: "Logged out successfully" }),
        {
          status: response.status,
          headers: {
            "Set-Cookie": setCookie,
          },
        }
      );
    }

    return NextResponse.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { message: "Network error - Unable to logout" },
      { status: 500 }
    );
  }
}
