import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { GetStoresQuery } from "@/graphql-codegen/frontend/graphql";
import { Loader, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

interface CreateStoreDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCreateStore: (name: string) => void;
  isCreating: boolean;
  existingStores: GetStoresQuery["getStores"];
}

const CreateStoreDialog: React.FC<CreateStoreDialogProps> = ({ isOpen, onOpenChange, onCreateStore, isCreating, existingStores }) => {
  const [newStoreName, setNewStoreName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setNewStoreName("");
      setErrorMessage(null);
      setIsDirty(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isDirty) return;

    const trimmedName = newStoreName.trim();
    if (!trimmedName) {
      setErrorMessage("Store name cannot be empty");
    } else if (existingStores.some((store) => store.name === trimmedName)) {
      setErrorMessage("Store name already exists.");
    } else {
      setErrorMessage(null);
    }
  }, [newStoreName, existingStores, isDirty]);

  const handleCreateStore = () => {
    const trimmedName = newStoreName.trim();
    if (!trimmedName || errorMessage) {
      return;
    }
    onCreateStore(trimmedName);
    setNewStoreName("");
    onOpenChange(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewStoreName(e.target.value);
    setIsDirty(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Store
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg bg-white p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle>Create Store</DialogTitle>
          <DialogDescription>Enter the name of the new store.</DialogDescription>
        </DialogHeader>
        <Input value={newStoreName} onChange={handleInputChange} className={`truncate font-medium ${errorMessage ? "border-red-500" : ""}`} />
        <DialogFooter className="flex items-center">
          {errorMessage && <p className="mr-auto text-sm text-red-500">{errorMessage}</p>}
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleCreateStore} disabled={isCreating || !!errorMessage}>
            {isCreating ? <Loader className="h-4 w-4 animate-spin" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStoreDialog;
