import { useCities } from "@/components/store/city";
import { useMainTime } from "@/components/store/timezone";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CityHelper } from "@/lib/city";
import { cn } from "@/lib/utils";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { ChevronUp, X } from "lucide-react";
import { ComponentProps } from "react";

interface TimezoneListProps {
  utc: Date;
}

const TimeCell = ({
  utc,
  timezone,
  className,
  ...rest
}: { utc: Date; timezone: string } & ComponentProps<typeof TableCell>) => {
  const { setMainDateTime } = useMainTime();
  return (
    <TableCell
      {...rest}
      onClick={() => setMainDateTime(utc)}
      className={cn("w-[86px] min-w-[86px] hover:cursor-pointer", className)}
    >
      <div className="text-center">
        {formatInTimeZone(utc, timezone, "MMM, do eee")}
      </div>
      <div className="text-center">
        {formatInTimeZone(utc, timezone, "HH:mm")}
      </div>
    </TableCell>
  );
};

export function CityList({ utc }: TimezoneListProps) {
  const { removeCity, selectedCities } = useCities();

  const { setMainDateTime, setMainTimezone } = useMainTime();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>City Name</TableHead>
          <TableHead>Timezone</TableHead>
          <TableHead colSpan={11} className="text-center">
            Date & Time
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {selectedCities.map((city) => {
          const { id, timezone } = city;
          return (
            <TableRow key={id}>
              <TableCell>{CityHelper.getCityCountryName(city)}</TableCell>
              <TableCell>{timezone}</TableCell>
              {Array.from({ length: 5 }).map((_, i) => {
                const dateTime = new Date(
                  utc.getTime() - (5 - i) * 30 * 60 * 1000,
                );
                return (
                  <TimeCell
                    key={`time-earlier-${city.id}-${i}`}
                    utc={dateTime}
                    timezone={timezone}
                  />
                );
              })}
              <TimeCell
                utc={utc}
                timezone={timezone}
                className="bg-yellow-400"
              />
              {Array.from({ length: 5 }).map((_, i) => {
                const dateTime = new Date(
                  utc.getTime() + (i + 1) * 30 * 60 * 1000,
                );
                return (
                  <TimeCell
                    utc={dateTime}
                    timezone={timezone}
                    key={`time-later-${city.id}-${i}`}
                  />
                );
              })}
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setMainDateTime(toZonedTime(utc, timezone));
                    setMainTimezone(timezone);
                  }}
                >
                  <ChevronUp className="text-blue-500" />
                </Button>
                <Button variant="ghost" onClick={() => removeCity(city)}>
                  <X className="text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
