"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GetGroceryItemsQuery } from "@/graphql-codegen/frontend/graphql";
import { motion } from "framer-motion";
import { DollarSign, Edit2, ShoppingBag, Tag, Trash2 } from "lucide-react";

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

type GroceryItem = GetGroceryItemsQuery["getGroceryItems"][number];

export function GroceryItemCard({
  item,
  onEdit,
  onDelete,
  className,
}: {
  item: GroceryItem;
  onEdit: (item: GroceryItem) => void;
  onDelete: (id: string) => void;
  className?: string;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={className}
    >
      <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-0">
          <div className="relative p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-2xl font-bold text-indigo-800 capitalize">
                {item.name}
              </h3>
              <div className="flex space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(item)}
                        className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-200"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Edit item</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit item</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete item</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete item</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="flex items-center text-indigo-600 mb-2">
              <ShoppingBag className="h-4 w-4 mr-2" />
              <span className="text-sm">{item.store.name}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-indigo-700">
                  {item.amount}
                </span>
                <span className="ml-1 text-indigo-600">{item.unit}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-3xl font-bold text-green-700">
                  {item.price}
                </span>
              </div>
            </div>
            <div className="flex items-center flex-wrap justify-between gap-2">
              <div className="text-sm text-indigo-600">
                Price per {item.unit}: ${item.pricePerUnit.toFixed(2)}/
                {item.unit}
              </div>
              <div className="flex gap-2 flex-wrap">
                {item.labels.map(({ id, name }) => (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="bg-indigo-200 text-indigo-800"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        </CardContent>
      </Card>
    </motion.div>
  );
}
export function GroceryItemCardSkeleton() {
  return (
    <Card className="bg-white/50 border-indigo-200 shadow-md overflow-hidden">
      <style>{shimmer}</style>
      <div className="animate-pulse">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <Skeleton
              className="h-6 w-1/3 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 rounded"
              style={{ animation: "shimmer 20s infinite linear" }}
            />
            <div className="flex space-x-2">
              <Skeleton
                className="h-8 w-8 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 rounded-full"
                style={{ animation: "shimmer 40s infinite linear" }}
              />
              <Skeleton
                className="h-8 w-8 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 rounded-full"
                style={{ animation: "shimmer 40s infinite linear" }}
              />
            </div>
          </CardTitle>
          <Skeleton
            className="h-4 w-1/4 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 rounded"
            style={{ animation: "shimmer 20s infinite linear" }}
          />
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <Skeleton
              className="h-4 w-1/5 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 rounded"
              style={{ animation: "shimmer 20s infinite linear" }}
            />
            <div className="flex space-x-2">
              <Skeleton
                className="h-6 w-16 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 rounded-full"
                style={{ animation: "shimmer 20s infinite linear" }}
              />
              <Skeleton
                className="h-6 w-16 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 rounded-full"
                style={{ animation: "shimmer 20s infinite linear" }}
              />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
