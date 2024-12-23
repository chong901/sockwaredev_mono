"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import UrlPreview from "@/components/url-preview";
import { GroceryItem } from "@/graphql/query";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Copy, DollarSign, Edit2, ExternalLink, ShoppingBag, Tag, Trash2 } from "lucide-react";

const shimmer = `
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
`;

type GroceryItemCardProps = {
  item: GroceryItem;
  onEdit: (item: GroceryItem) => void;
  onDelete: (id: string) => void;
  className?: string;
  onLabelClick?: (label: string) => void;
  onStoreClick?: (store: string) => void;
  onCopy?: (item: GroceryItem) => void;
};

export function GroceryItemCard({ item, onEdit, onDelete, className, onLabelClick, onStoreClick, onCopy }: GroceryItemCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={className}
    >
      <Card className="w-full overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardContent className="p-0">
          <div className="relative flex flex-col gap-2 p-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xl font-bold capitalize text-indigo-800 sm:text-2xl">
                {item.name}
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                    <ExternalLink className="h-5 w-5" />
                    <span className="sr-only">View product</span>
                  </a>
                )}
              </h3>
              <div className="flex space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(item)} className="text-indigo-600 hover:bg-indigo-200 hover:text-indigo-800">
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Edit item</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit item</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => onCopy?.(item)} className="text-indigo-600 hover:bg-indigo-200 hover:text-indigo-800">
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy item</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy item</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)} className="text-red-500 hover:bg-red-100 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete item</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete item</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="flex w-fit cursor-pointer items-center text-indigo-600" onClick={() => onStoreClick?.(item.store.name)}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span className="text-sm">{item.store.name}</span>
            </div>
            <div className="flex gap-2">
              {item.url && <UrlPreview url={item.url} className="h-auto w-40" />}
              <div className="flex flex-col justify-end gap-2">
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-indigo-700">{item.quantity}</span>
                  <span className="ml-1 text-indigo-600">{item.unit}</span>
                </div>
                <div className="text-sm text-indigo-600">
                  Price per {item.unit}: ~<span className="font-bold">${item.pricePerUnit.toFixed(2)}</span>/{item.unit}
                </div>
                <div className="text-sm text-indigo-600">Created At: {format(new Date(item.created_at), "MMM dd, yyyy")}</div>
              </div>
              <div className="ml-auto flex flex-col justify-end gap-2">
                <div className="flex items-center justify-end">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-3xl font-bold text-green-700">{item.price}</span>
                </div>
                {item.labels.length > 0 && (
                  <div className="flex flex-wrap justify-end gap-2">
                    {item.labels.map(({ id, name }) => (
                      <Badge key={id} variant="secondary" className="cursor-pointer bg-indigo-200 text-indigo-800" onClick={() => onLabelClick?.(name)}>
                        <Tag className="mr-1 h-3 w-3" />
                        {name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
export function GroceryItemCardSkeleton() {
  return (
    <Card className="overflow-hidden border-indigo-200 bg-white/50 shadow-md">
      <style>{shimmer}</style>
      <div className="animate-pulse">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <Skeleton className="h-6 w-1/3 rounded bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200" style={{ animation: "shimmer 20s infinite linear" }} />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200" style={{ animation: "shimmer 40s infinite linear" }} />
              <Skeleton className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200" style={{ animation: "shimmer 40s infinite linear" }} />
            </div>
          </CardTitle>
          <Skeleton className="h-4 w-1/4 rounded bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200" style={{ animation: "shimmer 20s infinite linear" }} />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-1/5 rounded bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200" style={{ animation: "shimmer 20s infinite linear" }} />
            <div className="flex space-x-2">
              <Skeleton className="h-6 w-16 rounded-full bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200" style={{ animation: "shimmer 20s infinite linear" }} />
              <Skeleton className="h-6 w-16 rounded-full bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200" style={{ animation: "shimmer 20s infinite linear" }} />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
