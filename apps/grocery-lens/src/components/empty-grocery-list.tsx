"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, ShoppingBasket } from "lucide-react";

export default function EmptyGroceryList({ onCreateNewItem }: { onCreateNewItem: () => void }) {
  return (
    <Card className="h-full w-full overflow-scroll p-12">
      <div className="flex h-full min-h-fit flex-col items-center justify-center space-y-6 text-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
          <ShoppingBasket className="h-12 w-12 text-primary" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-semibold tracking-tight">No items yet</h3>
          <p className="max-w-sm text-muted-foreground">Your grocery history is empty. Start by adding your first item to track quantities and prices.</p>
        </div>

        <Button size="lg" className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700" onClick={onCreateNewItem}>
          <Plus className="h-4 w-4" />
          Add Grocery Item
        </Button>
      </div>
    </Card>
  );
}
