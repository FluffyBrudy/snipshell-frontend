import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tags = searchParams.getAll("tags[]");

    const reqApiUrl = new URL(
      `${process.env.API_BASE_URL}/usercommand/search/tags`
    );
    for (const tag of tags) {
      reqApiUrl.searchParams.append("tags", tag);
    }
    const response = await fetch(reqApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: request.headers.get("Authorization") || "",
      },
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "User command search failed" }));
      return NextResponse.json(
        { message: errorData.message || "User command search failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[v0] User command search API error:", error);
    return NextResponse.json(
      { message: "Network error - API server may be offline" },
      { status: 500 }
    );
  }
}
