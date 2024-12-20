"use client";

import EmptyGroceryList from "@/components/empty-grocery-list";
import EmptySearchResult from "@/components/empty-search-result";
import { GroceryFilterComponent } from "@/components/grocery-filter";
import { GroceryItemCard, GroceryItemCardSkeleton } from "@/components/grocery-item-card";
import { editingItemAtom, GroceryItemFormModal, isEditModalOpenAtom } from "@/components/grocery-item-form-modal";
import { GroceryLensLogo } from "@/components/grocery-lens";
import { InfiniteScrollList } from "@/components/infinite-scroll-list";
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

const limit = 10;

export function GroceryListComponent() {
  const { labels, stores, keyword, sortBy, addLabelFilter, addStoreFilter, resetFilters } = useGroceryListFilter();

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
      <div className="flex-1 overflow-hidden">
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
                  className="mb-4"
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
                  className="mb-4"
                  onLabelClick={addLabelFilter}
                  onStoreClick={addStoreFilter}
                />
              )}
            </InfiniteScrollList>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
