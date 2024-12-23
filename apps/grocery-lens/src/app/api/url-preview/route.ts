import { UrlService } from "@/app/api/graphql/(services)/url-service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const preview = await UrlService.fetchUrlPreview(url);

    return NextResponse.json(preview);
  } catch (error) {
    console.error("Error fetching URL preview:", error);
    return NextResponse.json({ error: "Failed to fetch URL preview" }, { status: 500 });
  }
}
