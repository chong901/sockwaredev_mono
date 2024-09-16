import { GetBusArrivalQuery } from "@/graphql-codegen/frontend/graphql";
import { atom } from "jotai";

export const selectedBusServiceAtom = atom<
  GetBusArrivalQuery["getBusArrival"]["Services"][number] | undefined
>();
