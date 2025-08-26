import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${process.env.API_BASE_URL}/usercommand/favourite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: request.headers.get("Authorization") || "",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to toggle favorite" }));
      return NextResponse.json(
        { message: errorData.message || "Failed to toggle favorite" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[v0] Toggle favorite API error:", error);
    return NextResponse.json(
      { message: "Network error - API server may be offline" },
      { status: 500 }
    );
  }
}
