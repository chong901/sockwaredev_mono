"use client";
import EmptyStore from "@/components/empty-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AddStoreMutation, DeleteStoreMutation, GetStoresQuery } from "@/graphql-codegen/frontend/graphql";
import { ADD_STORE, DELETE_STORE, UPDATE_STORE } from "@/graphql/mutation";
import { getStoresQuery } from "@/graphql/query";
import { useMutation, useQuery } from "@apollo/client";
import { Check, Loader, Pencil, Search, Store, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import CreateStoreDialog from "./CreateStoreDialog";

const StoresPage: React.FC = () => {
  const { loading, error, data } = useQuery<GetStoresQuery>(getStoresQuery);
  const [deleteStore, { loading: isDeleting }] = useMutation<DeleteStoreMutation>(DELETE_STORE, {
    update(cache, { data }) {
      cache.evict({ id: cache.identify(data!.deleteStore) });
      cache.gc();
    },
  });
  const [updateStore, { loading: isSaving }] = useMutation(UPDATE_STORE);
  const [createStore, { loading: isCreating }] = useMutation<AddStoreMutation>(ADD_STORE, {
    update(cache, { data }) {
      const existingStores = cache.readQuery<GetStoresQuery>({ query: getStoresQuery });
      cache.writeQuery({
        query: getStoresQuery,
        data: { getStores: [data!.addStore, ...existingStores!.getStores] },
      });
    },
  });
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string>("");
  const [selectedStore, setSelectedStore] = useState<{ id: string; name: string; groceryItemsCount: number } | null>(null);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setEditingStoreId(null);
        setErrorMessage(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cardRef]);

  const handleDelete = async (id: string) => {
    await deleteStore({ variables: { id } });
    setSelectedStore(null);
  };

  const handleEdit = (store: { id: string; name: string }) => {
    setEditingStoreId(store.id);
    setStoreName(store.name);
  };

  const handleSave = async (id: string) => {
    const trimmedName = storeName.trim();
    await updateStore({ variables: { id, name: trimmedName } });
    setEditingStoreId(null);
  };

  const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setStoreName(newName);
    if (!newName.trim()) {
      setErrorMessage("Store name cannot be empty");
    } else if (data?.getStores.some((store) => store.name === newName && store.id !== editingStoreId)) {
      setErrorMessage("Store name already exists.");
    } else {
      setErrorMessage(null);
    }
  };

  const handleCreateStore = async (name: string) => {
    await createStore({ variables: { name } });
  };

  const handleViewGroceryItems = (storeName: string) => {
    router.push(`/?stores=${storeName}`);
  };

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex h-full max-w-full flex-col">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Stores</h1>
          <p className="text-muted-foreground">Manage your stores</p>
        </div>
        <CreateStoreDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onCreateStore={handleCreateStore}
          isCreating={isCreating}
          existingStores={data?.getStores || []}
        />
      </div>

      {loading && (!data || data.getStores.length === 0) ? (
        <div className="grid flex-1 gap-4 overflow-scroll">
          {[...Array(5)].map((_, index) => (
            <Card key={index}>
              <CardContent className="flex items-center p-4">
                <Skeleton className="mr-4 h-10 w-10 rounded-full" />
                <div className="min-w-0 flex-1">
                  <Skeleton className="mb-2 h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-scroll">
          {data?.getStores.length === 0 ? (
            <EmptyStore onCreateNewStore={() => setCreateDialogOpen(true)} />
          ) : (
            data?.getStores.map((store) => (
              <Card key={store.id} ref={editingStoreId === store.id ? cardRef : null}>
                <CardContent className="flex items-center p-4">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    {editingStoreId === store.id ? (
                      <>
                        <Input value={storeName} onChange={handleStoreNameChange} className={`truncate font-medium ${errorMessage ? "border-red-500" : ""}`} disabled={isSaving} />
                        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                      </>
                    ) : (
                      <>
                        <h3 className="break-words font-medium">{store.name}</h3>
                        <p className="text-sm text-muted-foreground">{store.groceryItemsCount} items</p>
                      </>
                    )}
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    {editingStoreId === store.id ? (
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSave(store.id)} disabled={isSaving || !!errorMessage}>
                        {isSaving ? <Loader className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        <span className="sr-only">Save {store.name}</span>
                      </Button>
                    ) : (
                      <>
                        {store.groceryItemsCount > 0 && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewGroceryItems(store.name)}>
                            <Search className="h-4 w-4" />
                            <span className="sr-only">View {store.name}</span>
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(store)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit {store.name}</span>
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon" className={`relative h-8 w-8 text-destructive hover:text-destructive`} onClick={() => setSelectedStore(store)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete {store.name}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {selectedStore && (
        <Dialog open={!!selectedStore} onOpenChange={() => setSelectedStore(null)}>
          <DialogContent className="rounded-lg bg-white p-6 shadow-lg">
            <DialogHeader>
              <DialogTitle>Delete store</DialogTitle>
              {selectedStore.groceryItemsCount > 0 ? (
                <DialogDescription>You cannot delete {selectedStore.name} because it has associated grocery items.</DialogDescription>
              ) : (
                <DialogDescription>
                  Are you sure you want to delete <strong>{selectedStore.name}</strong>? This action cannot be undone.
                </DialogDescription>
              )}
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => handleDelete(selectedStore.id)}
                disabled={selectedStore.groceryItemsCount > 0 || isDeleting}
              >
                {isDeleting ? <Loader className="h-4 w-4 animate-spin" /> : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default StoresPage;
