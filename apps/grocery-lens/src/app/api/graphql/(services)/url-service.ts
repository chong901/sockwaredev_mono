import * as cheerio from "cheerio";

export class UrlService {
  static async fetchUrlPreview(url: string) {
    try {
      // Fetch the HTML content
      const response = await fetch(url);
      const html = await response.text();

      // Parse the HTML
      const $ = cheerio.load(html);

      // Extract metadata
      const title = $('meta[property="og:title"]').attr("content") || $("title").text() || "";
      const description = $('meta[property="og:description"]').attr("content") || $('meta[name="description"]').attr("content") || "";
      const image = $('meta[property="og:image"]').attr("content") || $('meta[property="twitter:image"]').attr("content") || "";

      return {
        title,
        description,
        image,
        url,
      };
    } catch (error) {
      console.error("Error fetching URL preview:", error);
      return {};
    }
  }
}
