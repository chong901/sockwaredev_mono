"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Store } from "lucide-react";

export default function EmptyStore({ onCreateNewStore }: { onCreateNewStore: () => void }) {
  return (
    <Card className="h-full overflow-scroll py-4">
      <div className="flex h-full min-h-fit w-full flex-col items-center justify-center gap-6 text-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
          <Store className="h-12 w-12 text-primary" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-semibold tracking-tight">No stores yet</h3>
          <p className="max-w-sm text-muted-foreground">Your store list is empty. Start by adding your first store to manage your inventory.</p>
        </div>

        <Button size="lg" className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700" onClick={onCreateNewStore}>
          <Plus className="h-4 w-4" />
          Add Store
        </Button>
      </div>
    </Card>
  );
}
