import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Fetch the HTML content
    const response = await fetch(url);
    const html = await response.text();

    // Parse the HTML
    const $ = cheerio.load(html);

    // Extract metadata
    const title = $('meta[property="og:title"]').attr("content") || $("title").text() || "";

    const description = $('meta[property="og:description"]').attr("content") || $('meta[name="description"]').attr("content") || "";

    const image = $('meta[property="og:image"]').attr("content") || $('meta[property="twitter:image"]').attr("content") || "";

    return NextResponse.json({
      title,
      description,
      image,
      url,
    });
  } catch (error) {
    console.error("Error fetching URL preview:", error);
    return NextResponse.json({ error: "Failed to fetch URL preview" }, { status: 500 });
  }
}
