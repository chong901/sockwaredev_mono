"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  AddGroceryItemMutation,
  AddGroceryItemMutationVariables,
  AddLabelMutation,
  AddLabelMutationVariables,
  AddStoreMutation,
  AddStoreMutationVariables,
  GetLabelsQuery,
  GetStoresQuery,
  UpdateGroceryItemMutation,
  UpdateGroceryItemMutationVariables,
} from "@/graphql-codegen/frontend/graphql";
import { addGroceryItemMutation, addLabelMutation, addStoreMutation, updateGroceryItemMutation } from "@/graphql/mutation";
import { getLabelQuery, getStoresQuery, GroceryItem } from "@/graphql/query";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommandList } from "cmdk";
import { motion } from "framer-motion";
import { atom, useAtom } from "jotai";
import { Check, ChevronsUpDown, Loader2, PlusCircle, PlusIcon, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

export const editingItemAtom = atom<(Omit<GroceryItem, "id"> & { id?: string }) | undefined>(undefined);
export const isEditModalOpenAtom = atom(false);

const formSchema = z.object({
  id: z.string().optional(),
  itemName: z.string().min(1, { message: "Item name is required" }),
  storeId: z.string({ message: "Store is required" }).min(1, { message: "Store is required" }),
  price: z
    .number({
      message: "Price is required",
    })
    .gt(0, { message: "Price must be a positive number" }),
  quantity: z
    .number({
      message: "Quantity is required",
    })
    .gt(0, { message: "Quantity must be a positive number" }),
  unit: z.enum(["gram", "bag", "kilogram", "piece", "liter", "box"], {
    required_error: "Unit is required",
    message: "Unit is required",
  }),
  labels: z.array(z.string()),
  url: z.string().url().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const defaultFormData = {
  itemName: "",
  store: "",
  price: 0,
  quantity: 0,
  unit: undefined,
  labels: [],
  notes: "",
};

export function GroceryItemFormModal({ onAfterAddItem }: { onAfterAddItem?: () => void }) {
  const [item, setItem] = useAtom(editingItemAtom);
  const [isOpen, setIsOpen] = useAtom(isEditModalOpenAtom);
  const [openLabels, setOpenLabels] = useState(false);
  const [openStores, setOpenStores] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [storeSearch, setStoreSearch] = useState("");
  const { toast } = useToast();
  const { data: getLabelsData, loading: getLabelsLoading } = useQuery<GetLabelsQuery>(getLabelQuery);
  const { data: getStoresData, loading: getStoresLoading } = useQuery<GetStoresQuery>(getStoresQuery);

  const [addLabel, { loading: addLabelLoading }] = useMutation<AddLabelMutation, AddLabelMutationVariables>(addLabelMutation);
  const [addStore, { loading: addStoreLoading }] = useMutation<AddStoreMutation, AddStoreMutationVariables>(addStoreMutation);
  const [addGroceryItem] = useMutation<AddGroceryItemMutation, AddGroceryItemMutationVariables>(addGroceryItemMutation);
  const [updateGroceryItem] = useMutation<UpdateGroceryItemMutation, UpdateGroceryItemMutationVariables>(updateGroceryItemMutation);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, touchedFields, dirtyFields, isSubmitting },
    setValue,
    getValues,
    trigger,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: defaultFormData,
  });

  const isSubmitButtonEnable = !isSubmitting;
  const isEditing = !!item?.id;

  const unitOptions = ["gram", "bag", "kilogram", "piece", "liter", "box"];

  const labels = getLabelsData?.getLabels ?? [];
  const stores = getStoresData?.getStores ?? [];

  const handleAddLabel = async (labelName: string) => {
    const labelsValue = getValues("labels");
    if (labelName && !labels.find((label) => label.name === labelName)) {
      const result = await addLabel({
        variables: { name: labelName },
        refetchQueries: [{ query: getLabelQuery }],
      });
      setValue("labels", [...labelsValue, result.data!.addLabel.id], {
        shouldValidate: true,
      });
      setNewLabel("");
    }
  };

  const handleAddStore = async () => {
    if (storeSearch) {
      const result = await addStore({
        variables: { name: storeSearch },
        refetchQueries: [{ query: getStoresQuery }],
      });

      setValue("storeId", result.data!.addStore.id, { shouldValidate: true });
      setStoreSearch("");
      setOpenStores(false);
    }
  };

  useEffect(() => {
    if (!item) {
      reset(defaultFormData);
    } else {
      reset({
        id: item.id,
        quantity: item.quantity,
        itemName: item.name,
        labels: item.labels.map((l) => l.id),
        notes: item.notes ?? "",
        price: item.price,
        storeId: item.store.id,
        unit: item.unit as FormData["unit"],
      });
    }
  }, [item, reset]);

  const onSubmit = async (data: FormData) => {
    if (data.id) {
      const { id, ...rest } = data;
      await updateGroceryItem({
        variables: { id, input: rest },
      });
    } else {
      await addGroceryItem({
        variables: { input: { ...data, unit: data.unit } },
      });
      await onAfterAddItem?.();
    }
    toast({
      title: "Item added successfully",
      description: `${data.itemName} has been added to your grocery list.`,
    });
    reset(defaultFormData);
    setIsOpen(false);
  };

  const handleAddGroceryItemClick = () => {
    setItem(undefined);
    reset(defaultFormData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={handleAddGroceryItemClick}>
          <p className="hidden sm:block">Add Grocery Item</p>
          <PlusIcon className="sm:hidden" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-svh max-w-full overflow-scroll rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 p-4 shadow-lg sm:h-fit sm:max-w-[425px] sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
              <ShoppingCart className="mx-auto mb-2 h-16 w-16 text-indigo-600" />
            </motion.div>
            <h3 className="mb-2 mt-4 text-3xl font-bold text-indigo-800">{isEditing ? "Edit" : "Add"} Grocery Item</h3>
          </DialogTitle>
          <DialogDescription className="text-center text-indigo-600">
            {isEditing ? "Update the details of the grocery item you want to modify." : "Fill in the details of the grocery item you want to add."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="itemName" className="text-indigo-700">
              Item Name *
            </Label>
            <Input
              id="itemName"
              {...register("itemName", {
                onChange: () => trigger("itemName"),
              })}
              placeholder="Enter item name"
              className={cn(
                "border-indigo-300 bg-white/50 focus:border-indigo-500 focus:ring-indigo-500",
                errors.itemName && (touchedFields.itemName || dirtyFields.itemName) ? "border-red-500" : "",
              )}
            />
            {errors.itemName && (touchedFields.itemName || dirtyFields.itemName) && <p className="text-sm text-red-500">{errors.itemName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="store" className="text-indigo-700">
              Store *
            </Label>
            <Controller
              control={control}
              name="storeId"
              render={({ field: { value: storeValue } }) => (
                <Popover open={openStores} onOpenChange={setOpenStores}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openStores}
                      className={cn(
                        "w-full justify-between border-indigo-300 bg-white/50 focus:border-indigo-500 focus:ring-indigo-500",
                        errors.storeId && (touchedFields.storeId || dirtyFields.storeId) ? "border-red-500" : "",
                      )}
                    >
                      {stores.find((store) => store.id === storeValue)?.name || "Select store..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search store..." value={storeSearch} onValueChange={setStoreSearch} className="h-9" />
                      <CommandEmpty>No store found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {getStoresLoading ? (
                            <>
                              <Skeleton className="mb-2 h-8 w-full" />
                              <Skeleton className="mb-2 h-8 w-full" />
                              <Skeleton className="h-8 w-full" />
                            </>
                          ) : (
                            stores.map(({ id, name }) => (
                              <CommandItem
                                key={id}
                                onSelect={() => {
                                  setValue("storeId", id, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  });
                                  setOpenStores(false);
                                }}
                              >
                                <Check className={cn("mr-2 h-4 w-4", storeValue === id ? "opacity-100" : "opacity-0")} />
                                {name}
                              </CommandItem>
                            ))
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                    <div className="flex items-center border-t p-2">
                      <Button disabled={!!stores.find((s) => s.name === storeSearch) || !storeSearch || addStoreLoading} type="button" onClick={handleAddStore} className="ml-auto">
                        {addStoreLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.storeId && <p className="text-sm text-red-500">{errors.storeId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-indigo-700">
              Price *
            </Label>
            <Input
              id="price"
              type="number"
              {...register("price", {
                valueAsNumber: true,
                onChange: () => trigger("price"),
              })}
              placeholder="Enter price"
              step="0.01"
              className={cn(
                "border-indigo-300 bg-white/50 focus:border-indigo-500 focus:ring-indigo-500",
                errors.price && (touchedFields.price || dirtyFields.price) ? "border-red-500" : "",
              )}
            />
            {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-indigo-700">Quantity and Unit *</Label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  id="quantity"
                  type="number"
                  {...register("quantity", {
                    valueAsNumber: true,
                    onChange: () => trigger("quantity"),
                  })}
                  placeholder="Quantity"
                  className={cn(
                    "border-indigo-300 bg-white/50 focus:border-indigo-500 focus:ring-indigo-500",
                    errors.quantity && (touchedFields.quantity || dirtyFields.quantity) ? "border-red-500" : "",
                  )}
                />
                {errors.quantity && <p className="text-sm text-red-500">{errors.quantity.message}</p>}
              </div>
              <div className="flex-1">
                <Controller
                  name="unit"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        trigger("unit");
                      }}
                      value={field.value}
                    >
                      <SelectTrigger
                        id="unit"
                        className={cn(
                          "border-indigo-300 bg-white/50 focus:border-indigo-500 focus:ring-indigo-500",
                          errors.unit && (touchedFields.unit || dirtyFields.unit) ? "border-red-500" : "",
                        )}
                      >
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {unitOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.unit && <p className="text-sm text-red-500">{errors.unit.message}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="labels" className="text-indigo-700">
              Labels
            </Label>
            <Controller
              control={control}
              name="labels"
              render={({ field: { value: labelsValue } }) => (
                <Popover open={openLabels} onOpenChange={setOpenLabels} modal>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={openLabels}
                      className={cn(
                        "w-full justify-between border-indigo-300 bg-white/50 focus:border-indigo-500 focus:ring-indigo-500",
                        errors.labels && (touchedFields.labels || dirtyFields.labels) ? "border-red-500" : "",
                      )}
                    >
                      {labelsValue.length > 0
                        ? labels
                            .filter((label) => labelsValue.includes(label.id))
                            .map((label) => label.name)
                            .join(", ")
                        : "Select labels..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" style={{ width: "var(--radix-popover-trigger-width)" }}>
                    <Command
                      filter={(value, search) => {
                        if (value.toLowerCase().includes(search.toLowerCase())) return 1;
                        return 0;
                      }}
                    >
                      <CommandInput
                        placeholder="Search or create label"
                        value={newLabel}
                        onValueChange={setNewLabel}
                        onKeyDown={async (e) => {
                          if (e.key === "Enter" && newLabel) {
                            await handleAddLabel(newLabel);
                          }
                        }}
                        className="h-9"
                      />
                      <CommandEmpty>No label found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup className="max-h-40 overflow-y-auto">
                          {getLabelsLoading ? (
                            <>
                              <Skeleton className="mb-2 h-8 w-full" />
                              <Skeleton className="mb-2 h-8 w-full" />
                              <Skeleton className="h-8 w-full" />
                            </>
                          ) : (
                            labels.map(({ id, name }) => (
                              <CommandItem
                                key={id}
                                onSelect={() => {
                                  setValue("labels", labelsValue.includes(id) ? labelsValue.filter((l) => l !== id) : [...labelsValue, id], {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  });
                                  trigger("labels");
                                }}
                              >
                                <Check className={cn("mr-2 h-4 w-4", labelsValue.includes(id) ? "opacity-100" : "opacity-0")} />
                                {name}
                              </CommandItem>
                            ))
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                    <div className="flex items-center border-t p-2">
                      <Button
                        type="button"
                        size="sm"
                        disabled={!!labels.find((l) => l.name === newLabel) || !newLabel || addLabelLoading}
                        onClick={() => handleAddLabel(newLabel)}
                        className="ml-auto"
                      >
                        {addLabelLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.labels && <p className="text-sm text-red-500">{errors.labels.message}</p>}
          </div>
          <Controller
            control={control}
            name="url"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="url" className="text-indigo-700">
                  Url
                </Label>
                <Input id="url" {...field} placeholder="Enter the link to the item" className="border-indigo-300 bg-white/50 focus:border-indigo-500 focus:ring-indigo-500" />
                {errors.url && <p className="text-sm text-red-500">{errors.url.message}</p>}
              </div>
            )}
          />

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-indigo-700">
              Notes
            </Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Enter any additional notes"
              rows={3}
              className="border-indigo-300 bg-white/50 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-indigo-500 bg-white px-4 py-2 font-semibold text-indigo-700 transition-colors duration-300 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <motion.div whileHover={!isSubmitButtonEnable ? undefined : { scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                disabled={!isSubmitButtonEnable}
                className="rounded-full bg-indigo-600 px-4 py-2 font-bold text-white transition-colors duration-300 hover:bg-indigo-700"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : `${isEditing ? "Save" : "Add"} Item`}
              </Button>
            </motion.div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
