"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Search } from "lucide-react";

interface EmptySearchResultsProps {
  onReset: () => void;
}

export default function EmptySearchResult({
  onReset,
}: EmptySearchResultsProps) {
  return (
    <Card className="flex h-full min-h-fit w-full flex-col justify-center p-12">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
          <Search className="h-12 w-12 text-primary" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-semibold tracking-tight">
            No results found
          </h3>
          <p className="max-w-sm text-muted-foreground">
            We couldn&apos;t find any items matching the filters. Try checking
            for typos or using different filters.
          </p>
        </div>

        <Button variant="outline" size="lg" onClick={onReset} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Reset Search
        </Button>
      </div>
    </Card>
  );
}
