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
  const [items, setItems] = useState<GroceryItem[]>([
    {
      id: 1,
      name: "Milk",
      amount: 1,
      unit: "liter",
      price: 2.99,
      store: "Supermarket",
      labels: ["Dairy"],
    },
    {
      id: 2,
      name: "Bread",
      amount: 1,
      unit: "piece",
      price: 1.99,
      store: "Bakery",
      labels: ["Bakery"],
    },
    {
      id: 3,
      name: "Apples",
      amount: 1,
      unit: "kilogram",
      price: 3.99,
      store: "Fruit Market",
      labels: ["Fruit"],
    },
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newItem, setNewItem] = useState<Partial<GroceryItem>>({});

  const handleEditItem = (id: number) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, ...newItem } : item
    );
    setItems(updatedItems);
    setEditingId(null);
    setNewItem({});
  };

  const handleDeleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
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
          {items.map((item) => (
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
                    {item.store} - ${item.price.toFixed(2)}
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
                      {item.labels.map((label) => (
                        <motion.div
                          key={label}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Badge
                            variant="secondary"
                            className="bg-indigo-100 text-indigo-800"
                          >
                            {label}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
    </motion.div>
  );
}
