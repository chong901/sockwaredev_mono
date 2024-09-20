"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Unit,
} from "@/graphql-codegen/frontend/graphql";
import {
  addGroceryItemMutation,
  addLabelMutation,
  addStoreMutation,
} from "@/graphql/mutation";
import {
  getGroceryItemsQuery,
  getLabelQuery,
  getStoresQuery,
} from "@/graphql/query";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommandList } from "cmdk";
import { motion } from "framer-motion";
import {
  Check,
  ChevronsUpDown,
  Loader2,
  PlusCircle,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  itemName: z.string().min(1, { message: "Item name is required" }),
  store: z.string().min(1, { message: "Store is required" }),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price is required",
    })
    .min(0, { message: "Price must be a positive number" }),
  amount: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price is required",
    })
    .min(0, { message: "Amount must be a positive number" }),
  unit: z.enum(["gram", "bag", "kilogram", "piece", "liter", "box"], {
    required_error: "Unit is required",
  }),
  labels: z
    .array(z.string())
    .min(1, { message: "At least one label is required" }),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function GroceryItemFormModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [openLabels, setOpenLabels] = useState(false);
  const [openStores, setOpenStores] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newStore, setNewStore] = useState("");
  const { toast } = useToast();
  const { data: getLabelsData, loading: getLabelsLoading } =
    useQuery<GetLabelsQuery>(getLabelQuery);
  const { data: getStoresData, loading: getStoresLoading } =
    useQuery<GetStoresQuery>(getStoresQuery);

  const [addLabel, { loading: addLabelLoading }] = useMutation<
    AddLabelMutation,
    AddLabelMutationVariables
  >(addLabelMutation);
  const [addStore, { loading: addStoreLoading }] = useMutation<
    AddStoreMutation,
    AddStoreMutationVariables
  >(addStoreMutation);
  const [addGroceryItem] = useMutation<
    AddGroceryItemMutation,
    AddGroceryItemMutationVariables
  >(addGroceryItemMutation);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, touchedFields, dirtyFields },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      itemName: "",
      store: "",
      price: 0,
      amount: 0,
      unit: undefined,
      labels: [],
      notes: "",
    },
  });

  const unitOptions = ["gram", "bag", "kilogram", "piece", "liter", "box"];

  const watchedLabels = watch("labels", []);
  const watchedStore = watch("store", "");

  const labels = getLabelsData?.getLabels ?? [];
  const stores = getStoresData?.getStores ?? [];

  const handleAddLabel = async () => {
    if (newLabel && !watchedLabels.includes(newLabel)) {
      await addLabel({
        variables: { name: newLabel },
        refetchQueries: [{ query: getLabelQuery }],
      });
      setValue("labels", [...watchedLabels, newLabel], {
        shouldValidate: true,
      });
      setNewLabel("");
    }
  };

  const handleAddStore = async () => {
    if (newStore) {
      await addStore({
        variables: { name: newStore },
        refetchQueries: [{ query: getStoresQuery }],
      });
      setValue("store", newStore, { shouldValidate: true });
      setNewStore("");
      setOpenStores(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    await addGroceryItem({
      variables: { input: { ...data, unit: data.unit as Unit } },
      refetchQueries: [{ query: getGroceryItemsQuery }],
    });
    toast({
      title: "Item added successfully",
      description: `${data.itemName} has been added to your grocery list.`,
    });
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Add Grocery Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <ShoppingCart className="w-16 h-16 mx-auto text-indigo-600 mb-2" />
            </motion.div>
            <h2 className="text-3xl font-bold text-indigo-800 mt-4 mb-2">
              Add Grocery Item
            </h2>
          </DialogTitle>
          <DialogDescription className="text-center text-indigo-600">
            Fill in the details of the grocery item you want to add.
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
                "bg-white/50 border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500",
                errors.itemName &&
                  (touchedFields.itemName || dirtyFields.itemName)
                  ? "border-red-500"
                  : ""
              )}
            />
            {errors.itemName &&
              (touchedFields.itemName || dirtyFields.itemName) && (
                <p className="text-red-500 text-sm">
                  {errors.itemName.message}
                </p>
              )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="store" className="text-indigo-700">
              Store *
            </Label>
            <Popover open={openStores} onOpenChange={setOpenStores}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openStores}
                  className={cn(
                    "w-full justify-between bg-white/50 border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500",
                    errors.store && (touchedFields.store || dirtyFields.store)
                      ? "border-red-500"
                      : ""
                  )}
                >
                  {watchedStore || "Select store..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search store..." className="h-9" />
                  <CommandEmpty>No store found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {getStoresLoading ? (
                        <>
                          <Skeleton className="h-8 w-full mb-2" />
                          <Skeleton className="h-8 w-full mb-2" />
                          <Skeleton className="h-8 w-full" />
                        </>
                      ) : (
                        stores.map(({ id, name }) => (
                          <CommandItem
                            key={id}
                            onSelect={() => {
                              setValue("store", name, {
                                shouldValidate: true,
                              });
                              setOpenStores(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                watchedStore === name
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {name}
                          </CommandItem>
                        ))
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
                <div className="flex items-center border-t p-2">
                  <Input
                    placeholder="Add new store"
                    value={newStore}
                    onChange={(e) => setNewStore(e.target.value)}
                    className="flex-grow"
                  />
                  <Button
                    disabled={
                      !!stores.find((s) => s.name === newStore) ||
                      !newStore ||
                      addStoreLoading
                    }
                    type="button"
                    onClick={handleAddStore}
                    className="ml-2"
                  >
                    {addStoreLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <PlusCircle className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            {errors.store && (touchedFields.store || dirtyFields.store) && (
              <p className="text-red-500 text-sm">{errors.store.message}</p>
            )}
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
                "bg-white/50 border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500",
                errors.price && (touchedFields.price || dirtyFields.price)
                  ? "border-red-500"
                  : ""
              )}
            />
            {errors.price && (touchedFields.price || dirtyFields.price) && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-indigo-700">Amount and Unit *</Label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  id="amount"
                  type="number"
                  {...register("amount", {
                    valueAsNumber: true,
                    onChange: () => trigger("amount"),
                  })}
                  placeholder="Amount"
                  className={cn(
                    "bg-white/50 border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500",
                    errors.amount &&
                      (touchedFields.amount || dirtyFields.amount)
                      ? "border-red-500"
                      : ""
                  )}
                />
                {errors.amount &&
                  (touchedFields.amount || dirtyFields.amount) && (
                    <p className="text-red-500 text-sm">
                      {errors.amount.message}
                    </p>
                  )}
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
                          "bg-white/50 border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500",
                          errors.unit &&
                            (touchedFields.unit || dirtyFields.unit)
                            ? "border-red-500"
                            : ""
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
                {errors.unit && (touchedFields.unit || dirtyFields.unit) && (
                  <p className="text-red-500 text-sm">{errors.unit.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="labels" className="text-indigo-700">
              Labels *
            </Label>
            <Popover open={openLabels} onOpenChange={setOpenLabels}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={openLabels}
                  className={cn(
                    "w-full justify-between bg-white/50 border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500",
                    errors.labels &&
                      (touchedFields.labels || dirtyFields.labels)
                      ? "border-red-500"
                      : ""
                  )}
                >
                  {watchedLabels.length > 0
                    ? watchedLabels.join(", ")
                    : "Select labels..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search label..." className="h-9" />
                  <CommandEmpty>No label found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {getLabelsLoading ? (
                        <>
                          <Skeleton className="h-8 w-full mb-2" />
                          <Skeleton className="h-8 w-full mb-2" />
                          <Skeleton className="h-8 w-full" />
                        </>
                      ) : (
                        labels.map(({ id, name }) => (
                          <CommandItem
                            key={id}
                            onSelect={() => {
                              setValue(
                                "labels",
                                watchedLabels.includes(name)
                                  ? watchedLabels.filter((l) => l !== name)
                                  : [...watchedLabels, name],
                                { shouldValidate: true }
                              );
                              trigger("labels");
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                watchedLabels.includes(name)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {name}
                          </CommandItem>
                        ))
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
                <div className="flex items-center border-t p-2">
                  <Input
                    placeholder="Add new label"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="flex-grow"
                  />
                  <Button
                    type="button"
                    disabled={
                      !!labels.find((l) => l.name === newLabel) ||
                      !newLabel ||
                      addLabelLoading
                    }
                    onClick={handleAddLabel}
                    className="ml-2"
                  >
                    {addLabelLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <PlusCircle className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            {errors.labels && (touchedFields.labels || dirtyFields.labels) && (
              <p className="text-red-500 text-sm">{errors.labels.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-indigo-700">
              Notes
            </Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Enter any additional notes"
              rows={3}
              className="bg-white/50 border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="bg-white hover:bg-gray-100 text-indigo-700 font-semibold py-2 px-4 border border-indigo-500 rounded-full transition-colors duration-300"
            >
              Cancel
            </Button>
            <motion.div
              whileHover={!isValid ? undefined : { scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="submit"
                disabled={!isValid}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
              >
                Add Item
              </Button>
            </motion.div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
