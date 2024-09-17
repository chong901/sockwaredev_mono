import { BusStop } from "@/graphql-codegen/frontend/graphql";
import { Modal } from "@repo/ui/containers";
import { useState } from "react";

type SaveFavoriteBusStopProps = {
  busStop: BusStop;
  onClose: () => void;
  onSave: (name: string, busStop: BusStop) => void;
};
export const SaveFavoriteBusStopModal = ({
  busStop,
  onClose,
  onSave,
}: SaveFavoriteBusStopProps) => {
  const [busStopName, setBusStopName] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(busStopName, busStop);
  };
  return (
    <Modal className="absolute">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-4 rounded-lg bg-gradient-to-l from-slate-200 via-slate-300 to-slate-400 p-4 shadow-lg"
      >
        <label htmlFor="busStopName" className="text-lg font-medium">
          Enter a name to save this bus stop
        </label>
        <input
          type="text"
          id="busStopName"
          value={busStopName}
          onChange={(e) => setBusStopName(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Home"
          autoFocus
          required
        />
        <div className="flex w-full justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-black hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!busStopName}
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Save Favorite
          </button>
        </div>
      </form>
    </Modal>
  );
};
