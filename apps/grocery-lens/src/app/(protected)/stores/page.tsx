"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GetStoresQuery } from "@/graphql-codegen/frontend/graphql";
import { getStoresQuery } from "@/graphql/query";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Check, Pencil, Plus, Store, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const DELETE_STORE = gql`
  mutation DeleteStore($id: ID!) {
    deleteStore(id: $id) {
      id
    }
  }
`;

const UPDATE_STORE = gql`
  mutation UpdateStore($id: ID!, $name: String!) {
    updateStore(id: $id, name: $name) {
      id
      name
    }
  }
`;

const StoresPage: React.FC = () => {
  const { loading, error, data } = useQuery<GetStoresQuery>(getStoresQuery);
  const [deleteStore] = useMutation(DELETE_STORE);
  const [updateStore] = useMutation(UPDATE_STORE);
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setEditingStoreId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inputRef]);

  const handleDelete = (id: string) => {
    deleteStore({ variables: { id } });
  };

  const handleEdit = (store: { id: string; name: string }) => {
    setEditingStoreId(store.id);
    setStoreName(store.name);
  };

  const handleSave = (id: string) => {
    updateStore({ variables: { id, name: storeName } });
    setEditingStoreId(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Stores</h1>
          <p className="text-muted-foreground">Manage your store connections and settings</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Store
        </Button>
      </div>

      <div className="grid gap-4">
        {data?.getStores.map((store) => (
          <Card key={store.id} className="group">
            <CardContent className="flex items-center p-4">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Store className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                {editingStoreId === store.id ? (
                  <Input ref={inputRef} value={storeName} onChange={(e) => setStoreName(e.target.value)} className="truncate font-medium" />
                ) : (
                  <>
                    <h3 className="truncate font-medium">{store.name}</h3>
                    <p className="text-sm text-muted-foreground">{store.groceryItemsCount} items</p>
                  </>
                )}
              </div>
              <div className="ml-4 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                {editingStoreId === store.id ? (
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSave(store.id)}>
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Save {store.name}</span>
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(store)}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit {store.name}</span>
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete {store.name}</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete store</AlertDialogTitle>
                      <AlertDialogDescription>Are you sure you want to delete {store.name}? This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => handleDelete(store.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StoresPage;
