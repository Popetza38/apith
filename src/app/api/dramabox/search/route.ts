import { NextRequest, NextResponse } from "next/server";
import { API_CONFIG } from "@/lib/constants";

// ===========================================
// Vercel Runtime Configuration
// ===========================================
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const lang = searchParams.get("lang") || API_CONFIG.DEFAULT_LANGUAGE;

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const upstreamUrl = `${API_CONFIG.UPSTREAM_API}/api/dramabox/search?query=${encodeURIComponent(query)}&lang=${lang}`;
    console.log(`[API] Fetching from: ${upstreamUrl}`);

    const response = await fetch(upstreamUrl, {
      next: { revalidate: 240 },
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
        'Cache-Control': 'public, s-maxage=240, stale-while-revalidate=480',
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
