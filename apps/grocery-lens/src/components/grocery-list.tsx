"use client";

import { GroceryFilterComponent } from "@/components/grocery-filter";
import {
  GroceryItemCard,
  GroceryItemCardSkeleton,
} from "@/components/grocery-item-card";
import {
  editingItemAtom,
  GroceryItemFormModal,
  isEditModalOpenAtom,
} from "@/components/grocery-item-form-modal";
import {
  DeleteGroceryItemMutation,
  DeleteGroceryItemMutationVariables,
  GetGroceryItemsQuery,
} from "@/graphql-codegen/frontend/graphql";
import { deleteGroceryItemMutation } from "@/graphql/mutation";
import { getGroceryItemsQuery, GroceryItem } from "@/graphql/query";
import { useGroceryListFilter } from "@/hooks/use-grocery-list-filter";
import { useMutation, useQuery } from "@apollo/client";
import { AnimatePresence, motion } from "framer-motion";
import { useSetAtom } from "jotai";
import { ShoppingCart } from "lucide-react";

export function GroceryListComponent() {
  const { data: groceryItems, loading } =
    useQuery<GetGroceryItemsQuery>(getGroceryItemsQuery);
  const setEditingItem = useSetAtom(editingItemAtom);
  const setEditItemModalOpen = useSetAtom(isEditModalOpenAtom);
  const [deleteGroceryItem] = useMutation<
    DeleteGroceryItemMutation,
    DeleteGroceryItemMutationVariables
  >(deleteGroceryItemMutation, {
    update(cache, { data }) {
      cache.evict({ id: cache.identify(data!.deleteGroceryItem) });
      cache.gc();
    },
  });

  const { onFilterChange } = useGroceryListFilter();

  const handleDelete = async (id: string) => {
    deleteGroceryItem({ variables: { id } });
  };

  const handleEdit = (item: GroceryItem) => {
    setEditingItem(item);
    setEditItemModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 bg-gradient-to-br from-purple-100 to-indigo-100 h-full rounded-lg shadow-lg flex flex-col"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex flex-col gap-4 mb-4"
      >
        <div className="flex justify-between items-center">
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
        </div>

        <div className="w-full md:w-auto">
          <GroceryFilterComponent onFilterChange={onFilterChange} />
        </div>
      </motion.div>
      <div className="flex-1 overflow-scroll">
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
                  <GroceryItemCardSkeleton />
                </motion.div>
              ))}
            </>
          ) : (
            (groceryItems?.getGroceryItems ?? []).map((item) => (
              <GroceryItemCard
                key={item.id}
                item={item}
                onDelete={handleDelete}
                onEdit={handleEdit}
                className="mb-4"
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
