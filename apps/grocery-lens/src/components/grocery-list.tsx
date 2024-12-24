"use client";

import EmptyGroceryList from "@/components/empty-grocery-list";
import EmptySearchResult from "@/components/empty-search-result";
import { GroceryFilterComponent } from "@/components/grocery-filter";
import { GroceryItemCard, GroceryItemCardSkeleton } from "@/components/grocery-item-card";
import { editingItemAtom, GroceryItemFormModal, isEditModalOpenAtom } from "@/components/grocery-item-form-modal";
import { GroceryLensLogo } from "@/components/grocery-lens";
import { InfiniteScrollList } from "@/components/infinite-scroll-list";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DeleteGroceryItemMutation,
  DeleteGroceryItemMutationVariables,
  GetGroceryItemsQuery,
  GetGroceryItemsQueryVariables,
  GroceryItemSortBy,
} from "@/graphql-codegen/frontend/graphql";
import { deleteGroceryItemMutation } from "@/graphql/mutation";
import { getGroceryItemsQuery, GroceryItem } from "@/graphql/query";
import { useGroceryListFilter } from "@/hooks/use-grocery-list-filter";
import { useMutation, useQuery } from "@apollo/client";
import { AnimatePresence, motion } from "framer-motion";
import { useSetAtom } from "jotai";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const limit = 10;

export function GroceryListComponent() {
  const { labels, stores, keyword, sortBy, addLabelFilter, addStoreFilter, resetFilters } = useGroceryListFilter();
  const [selectedItem, setSelectedItem] = useState<GroceryItem | null>(null);

  const {
    data: groceryItems,
    loading,
    previousData,
    refetch,
    fetchMore,
  } = useQuery<GetGroceryItemsQuery, GetGroceryItemsQueryVariables>(getGroceryItemsQuery, {
    variables: {
      filter: {
        labels,
        stores,
        keyword,
        sortBy: sortBy as GroceryItemSortBy,
      },
      pagination: { limit, offset: 0 },
    },
    fetchPolicy: "cache-and-network",
  });
  const setEditingItem = useSetAtom(editingItemAtom);
  const setEditItemModalOpen = useSetAtom(isEditModalOpenAtom);
  const [deleteGroceryItem] = useMutation<DeleteGroceryItemMutation, DeleteGroceryItemMutationVariables>(deleteGroceryItemMutation, {
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

  const handleCopy = (item: GroceryItem) => {
    setEditingItem({ ...item, id: undefined });
    setEditItemModalOpen(true);
  };

  const handleNotesClick = (item: GroceryItem) => {
    setSelectedItem(item);
  };

  const hasFilterApplied = labels.length > 0 || stores.length > 0 || keyword;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-indigo-800 sm:text-4xl">
            {loading ? (
              <Loader2 className="h-10 w-10 animate-spin" />
            ) : (
              <motion.div initial={{ rotate: -20 }} animate={{ rotate: 0 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                <GroceryLensLogo className="h-10 w-10 text-indigo-600" />
              </motion.div>
            )}
            Grocery History
          </h1>
          <GroceryItemFormModal onAfterAddItem={refetch} />
        </div>

        <div className="w-full md:w-auto">
          <GroceryFilterComponent />
        </div>
      </div>
      <div className="flex w-full flex-1 flex-col gap-4 overflow-y-scroll">
        <AnimatePresence>
          {loading && !previousData && !groceryItems ? (
            <>
              {[1, 2, 3].map((index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <GroceryItemCardSkeleton />
                </motion.div>
              ))}
            </>
          ) : (
            <InfiniteScrollList
              emptyComponent={hasFilterApplied ? <EmptySearchResult onReset={resetFilters} /> : <EmptyGroceryList onCreateNewItem={() => setEditItemModalOpen(true)} />}
              items={groceryItems?.getGroceryItems ?? previousData?.getGroceryItems ?? []}
              loadMoreItems={() => {
                fetchMore({
                  variables: {
                    pagination: {
                      limit,
                      offset: groceryItems?.getGroceryItems.length ?? 0,
                    },
                  },
                });
              }}
              loading={loading}
            >
              {(item) => (
                <GroceryItemCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onCopy={handleCopy}
                  onLabelClick={addLabelFilter}
                  onStoreClick={addStoreFilter}
                  onNotesClick={handleNotesClick}
                />
              )}
            </InfiniteScrollList>
          )}
        </AnimatePresence>
      </div>

      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="bg-gradient-to-br from-purple-100 to-indigo-100">
            <DialogHeader>
              <DialogTitle>Notes for {selectedItem.name}</DialogTitle>
              <DialogDescription>{selectedItem.notes}</DialogDescription>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" onClick={() => setSelectedItem(null)}>
                  <span className="sr-only">Close</span>
                </Button>
              </DialogClose>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
