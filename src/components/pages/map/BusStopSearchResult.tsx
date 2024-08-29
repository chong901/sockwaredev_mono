import { SearchBusStopsQuery } from "@/graphql-codegen/frontend/graphql";
import React from "react";

type SearchResultsProps = {
  showSearchResult: boolean;
  busStops?: SearchBusStopsQuery["searchBusStops"];
  onItemClick: (stop: SearchBusStopsQuery["searchBusStops"][0]) => void;
};

const BusStopSearchResult: React.FC<SearchResultsProps> = ({
  showSearchResult,
  busStops,
  onItemClick,
}) => {
  if (!showSearchResult) return null;

  return (
    busStops &&
    busStops.length > 0 && (
      <div className="mt-2 flex max-h-[300px] flex-col overflow-y-scroll rounded-md bg-gradient-to-r from-blue-200 via-blue-100 to-blue-50 shadow-md lg:max-h-[600px]">
        {busStops.map((stop, index) => (
          <div
            key={stop.code}
            className="flex gap-4 px-4 py-2 text-2xl hover:cursor-pointer hover:font-bold"
            onClick={() => onItemClick(stop)}
          >
            <div>{stop.code}</div>
            <div>{stop.description}</div>
            {index < busStops.length - 1 && (
              <hr className="border-t border-slate-300" />
            )}
          </div>
        ))}
      </div>
    )
  );
};

export default BusStopSearchResult;
