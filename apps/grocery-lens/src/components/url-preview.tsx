"use client";

import { Card } from "@/components/ui/card";
import { ComponentProps } from "react";

interface UrlPreviewProps {
  url: string;
  alt: string;
}

export default function UrlPreview({ url, className, alt }: UrlPreviewProps & Pick<ComponentProps<"div">, "className">) {
  return (
    <div className={className}>
      <Card className="overflow-hidden bg-transparent transition-colors hover:bg-muted/50">
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          <div className="relative h-full w-full">
            <img src={url} alt={alt} className="rounded-md object-contain" />
          </div>
        </a>
      </Card>
    </div>
  );
}
