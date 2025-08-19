import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    let url = `${process.env.API_BASE_URL}/usercommand`;
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (params.toString()) url += `?${params.toString()}`;

    console.log(searchParams);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: request.headers.get("Authorization") || "",
      },
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to get user commands" }));
      return NextResponse.json(
        { message: errorData.message || "Failed to get user commands" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[v0] User commands API error:", error);
    return NextResponse.json(
      { message: "Network error - API server may be offline" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${process.env.API_BASE_URL}/usercommand`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: request.headers.get("Authorization") || "",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to create user command" }));
      return NextResponse.json(
        { message: errorData.message || "Failed to create user command" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[v0] Create user command API error:", error);
    return NextResponse.json(
      { message: "Network error - API server may be offline" },
      { status: 500 }
    );
  }
}
