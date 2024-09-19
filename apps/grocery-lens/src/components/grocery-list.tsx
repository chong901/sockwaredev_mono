"use client";

import { GroceryItemFormModal } from "@/components/grocery-item-form-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GetGroceryItemsQuery } from "@/graphql-codegen/frontend/graphql";
import { getGroceryItemsQuery } from "@/graphql/query";
import { useQuery } from "@apollo/client";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Edit, ShoppingCart, Trash2, X } from "lucide-react";
import { useState } from "react";

type GroceryItem = {
  id: number;
  name: string;
  amount: number;
  unit: string;
  price: number;
  store: string;
  labels: string[];
};

export function GroceryListComponent() {
  const { data: groceryItems, loading } =
    useQuery<GetGroceryItemsQuery>(getGroceryItemsQuery);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<GroceryItem>>({});

  const handleEditItem = (id: string) => {
    // const updatedItems = items.map((item) =>
    //   item.id === id ? { ...item, ...newItem } : item
    // );
    // setItems(updatedItems);
    // setEditingId(null);
    // setNewItem({});
  };

  const handleDeleteItem = (id: string) => {
    // setItems(items.filter((item) => item.id !== id));
  };

  const unitOptions = ["gram", "bag", "kilogram", "piece", "liter", "box"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 bg-gradient-to-br from-purple-100 to-indigo-100 min-h-screen rounded-lg shadow-lg"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-4xl font-bold text-indigo-800 flex items-center">
          <motion.div
            initial={{ rotate: -20 }}
            animate={{ rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <ShoppingCart className="mr-4 h-10 w-10 text-indigo-600" />
          </motion.div>
          Grocery List
        </h1>
        <GroceryItemFormModal />
      </motion.div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <AnimatePresence>
          {loading ? (
            <>
              {[1, 2, 3].map((index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="mb-4"
                >
                  <Card className="bg-white/50 border-indigo-200 shadow-md overflow-hidden">
                    <div className="animate-pulse">
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          <div
                            className="h-6 w-1/3 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 rounded"
                            style={{ animation: "shimmer 2s infinite linear" }}
                          />
                          <div className="flex space-x-2">
                            <div
                              className="h-8 w-8 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 rounded-full"
                              style={{
                                animation: "shimmer 2s infinite linear",
                              }}
                            />
                            <div
                              className="h-8 w-8 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 rounded-full"
                              style={{
                                animation: "shimmer 2s infinite linear",
                              }}
                            />
                          </div>
                        </CardTitle>
                        <div
                          className="h-4 w-1/4 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 rounded"
                          style={{ animation: "shimmer 2s infinite linear" }}
                        />
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div
                            className="h-4 w-1/5 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 rounded"
                            style={{ animation: "shimmer 2s infinite linear" }}
                          />
                          <div className="flex space-x-2">
                            <div
                              className="h-6 w-16 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 rounded-full"
                              style={{
                                animation: "shimmer 2s infinite linear",
                              }}
                            />
                            <div
                              className="h-6 w-16 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 rounded-full"
                              style={{
                                animation: "shimmer 2s infinite linear",
                              }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </>
          ) : (
            (groceryItems?.getGroceryItems ?? []).map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="mb-4"
              >
                <Card className="bg-white/50 border-indigo-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center text-indigo-800">
                      {editingId === item.id ? (
                        <Input
                          value={newItem.name || item.name}
                          onChange={(e) =>
                            setNewItem({ ...newItem, name: e.target.value })
                          }
                          className="font-bold bg-white/50 border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      ) : (
                        <span>{item.name}</span>
                      )}
                      <div className="flex space-x-2">
                        {editingId === item.id ? (
                          <>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button
                                size="sm"
                                onClick={() => handleEditItem(item.id)}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingId(null)}
                                className="border-indigo-300 text-indigo-600 hover:bg-indigo-100"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </>
                        ) : (
                          <>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingId(item.id)}
                                className="border-indigo-300 text-indigo-600 hover:bg-indigo-100"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteItem(item.id)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </>
                        )}
                      </div>
                    </CardTitle>
                    <CardDescription className="text-indigo-600">
                      {item.store.name} - ${item.price.toFixed(2)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-700">
                        {editingId === item.id ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              value={newItem.amount || item.amount}
                              onChange={(e) =>
                                setNewItem({
                                  ...newItem,
                                  amount: parseFloat(e.target.value),
                                })
                              }
                              className="w-20 bg-white/50 border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <Select
                              onValueChange={(value) =>
                                setNewItem({ ...newItem, unit: value })
                              }
                              value={newItem.unit || item.unit}
                            >
                              <SelectTrigger className="w-[100px] bg-white/50 border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500">
                                <SelectValue placeholder="Select unit" />
                              </SelectTrigger>
                              <SelectContent>
                                {unitOptions.map((unit) => (
                                  <SelectItem key={unit} value={unit}>
                                    {unit}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          `${item.amount} ${item.unit}`
                        )}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {item.labels.map(({ id, name }) => (
                          <motion.div
                            key={id}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Badge
                              variant="secondary"
                              className="bg-indigo-100 text-indigo-800"
                            >
                              {name}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </ScrollArea>
    </motion.div>
  );
}
