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
  GetGroceryItemsQueryVariables,
} from "@/graphql-codegen/frontend/graphql";
import { deleteGroceryItemMutation } from "@/graphql/mutation";
import { getGroceryItemsQuery, GroceryItem } from "@/graphql/query";
import { useGroceryListFilter } from "@/hooks/use-grocery-list-filter";
import { useMutation, useQuery } from "@apollo/client";
import { AnimatePresence, motion } from "framer-motion";
import { useSetAtom } from "jotai";
import { Loader2, ShoppingCart } from "lucide-react";

export function GroceryListComponent() {
  const { labels, stores, keyword, addLabelFilter, addStoreFilter } =
    useGroceryListFilter();
  const {
    data: groceryItems,
    loading,
    previousData,
  } = useQuery<GetGroceryItemsQuery, GetGroceryItemsQueryVariables>(
    getGroceryItemsQuery,
    {
      variables: { filter: { labels, stores, keyword } },
      fetchPolicy: "cache-and-network",
    },
  );
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
      className="container mx-auto flex h-full flex-col rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 p-6 shadow-lg"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="mb-4 flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <h1 className="flex items-center text-4xl font-bold text-indigo-800">
            {loading ? (
              <Loader2 className="mr-4 h-10 w-10 animate-spin" />
            ) : (
              <motion.div
                initial={{ rotate: -20 }}
                animate={{ rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <ShoppingCart className="mr-4 h-10 w-10 text-indigo-600" />
              </motion.div>
            )}
            Grocery List
          </h1>
          <GroceryItemFormModal />
        </div>

        <div className="w-full md:w-auto">
          <GroceryFilterComponent />
        </div>
      </motion.div>
      <div className="flex-1 overflow-scroll">
        <AnimatePresence>
          {loading && !previousData ? (
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
            (
              groceryItems?.getGroceryItems ??
              previousData?.getGroceryItems ??
              []
            ).map((item) => (
              <GroceryItemCard
                key={item.id}
                item={item}
                onDelete={handleDelete}
                onEdit={handleEdit}
                className="mb-4"
                onLabelClick={addLabelFilter}
                onStoreClick={addStoreFilter}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
