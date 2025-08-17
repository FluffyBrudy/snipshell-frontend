import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const args = searchParams.get("args")

    const response = await fetch(`${process.env.API_BASE_URL}/search?args=${encodeURIComponent(args || "")}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: request.headers.get("Authorization") || "",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "User command search failed" }))
      return NextResponse.json(
        { message: errorData.message || "User command search failed" },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] User command search API error:", error)
    return NextResponse.json({ message: "Network error - API server may be offline" }, { status: 500 })
  }
}
