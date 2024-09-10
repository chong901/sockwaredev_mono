import { LoadingSpinner } from "@/components/atoms/LoadingSpinner";
import { SearchBusStopsQuery } from "@/graphql-codegen/frontend/graphql";
import React, { ComponentProps, Fragment } from "react";

type SearchResultsProps = {
  showSearchResult: boolean;
  busStops?: SearchBusStopsQuery["searchBusStops"];
  onItemClick: (stop: SearchBusStopsQuery["searchBusStops"][0]) => void;
};

const Container = ({ className, ...rest }: ComponentProps<"div">) => (
  <div
    className={`mt-2 flex max-h-[300px] flex-col overflow-y-scroll rounded-md bg-gradient-to-r from-blue-200 via-blue-100 to-blue-50 shadow-md md:max-h-[600px] ${className ?? ""}`}
    {...rest}
  />
);

const BusStopSearchResult: React.FC<SearchResultsProps> = ({
  showSearchResult,
  busStops,
  onItemClick,
}) => {
  if (!showSearchResult) return null;
  if (!busStops)
    return (
      <Container className="flex items-center justify-center p-4">
        <LoadingSpinner />
      </Container>
    );
  if (busStops.length === 0)
    return (
      <Container className="flex items-center justify-center p-4 text-2xl">
        No bus stops found
      </Container>
    );
  return (
    <Container>
      {busStops.map((stop, index) => (
        <Fragment key={stop.code}>
          <div
            className="flex gap-4 px-4 py-2 text-2xl hover:cursor-pointer hover:font-bold"
            onClick={() => onItemClick(stop)}
          >
            <div>{stop.code}</div>
            <div>{stop.description}</div>
          </div>
          {index < busStops.length - 1 && (
            <hr className="w-full border-t border-slate-300" />
          )}
        </Fragment>
      ))}
    </Container>
  );
};

export default BusStopSearchResult;
