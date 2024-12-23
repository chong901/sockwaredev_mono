"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link2 } from "lucide-react";
import { ComponentProps, useEffect, useState } from "react";

interface UrlPreviewData {
  title: string;
  description: string;
  image: string;
  url: string;
}

interface UrlPreviewProps {
  url: string;
}

export default function UrlPreview({ url, className }: UrlPreviewProps & Pick<ComponentProps<"div">, "className">) {
  const [previewData, setPreviewData] = useState<UrlPreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch preview data when component mounts
  useEffect(() => {
    fetchUrlPreview(url);
  }, [url]);

  async function fetchUrlPreview(url: string) {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/url-preview", {
        method: "POST",
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch URL preview");
      }

      const data = await response.json();
      setPreviewData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load preview");
    } finally {
      setIsLoading(false);
    }
  }

  if (error) {
    return (
      <Card className={cn("overflow-hidden")}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Link2 className="h-4 w-4" />
            <span className="text-sm">{url}</span>
          </div>
          <p className="mt-2 text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className={cn("h-full w-full overflow-hidden", className)}>
        <Skeleton className="block h-full w-full bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200" />
      </Card>
    );
  }

  if (!previewData || !previewData.image) {
    return null;
  }

  return (
    <div className={className}>
      <Card className="overflow-hidden bg-transparent transition-colors hover:bg-muted/50">
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          {previewData.image && (
            <div className="relative h-full w-full">
              <img src={previewData.image} alt={previewData.title || "URL preview image"} className="rounded-md object-contain" />
            </div>
          )}
        </a>
      </Card>
    </div>
  );
}
