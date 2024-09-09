import { BusStop } from "@/graphql-codegen/frontend/graphql";
import { atom } from "jotai";

export const selectedBusStopAtom = atom<BusStop | null>(null);
