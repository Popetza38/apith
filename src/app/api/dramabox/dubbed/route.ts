import { NextRequest, NextResponse } from "next/server";
import { API_CONFIG } from "@/lib/constants";

// ===========================================
// Vercel Runtime Configuration
// ===========================================
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  // Map Indonesian classify values to English
  const classifyParam = searchParams.get("classify") || "terbaru";
  const classifyMap: Record<string, string> = {
    "terbaru": "latest",
    "terpopuler": "popular",
    "latest": "latest",
    "popular": "popular"
  };
  const classify = classifyMap[classifyParam] || "latest";
  const page = searchParams.get("page") || "1";
  const lang = searchParams.get("lang") || API_CONFIG.DEFAULT_LANGUAGE;

  try {
    const upstreamUrl = `${API_CONFIG.UPSTREAM_API}/api/dramabox/dubbed?classify=${classify}&page=${page}&lang=${lang}`;
    console.log(`[API] Fetching from: ${upstreamUrl}`);

    const response = await fetch(upstreamUrl, {
      next: { revalidate: 600 },
      headers: {
        'User-Agent': 'DramaBox-Web/1.0',
      },
    });

    if (!response.ok) {
      console.error(`[API] Upstream error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: "Failed to fetch data", status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    });
  } catch (error) {
    console.error("[API] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
