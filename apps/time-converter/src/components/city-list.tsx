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
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { ChevronUp, X } from "lucide-react";

interface TimezoneListProps {
  utc: Date;
}

export function CityList({ utc }: TimezoneListProps) {
  const { removeCity, selectedCities } = useCities();

  const { setMainDateTime, setMainTimezone } = useMainTime();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>City Name</TableHead>
          <TableHead>Timezone</TableHead>
          <TableHead>Date & Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {selectedCities.map((city) => {
          const { id, timezone } = city;
          return (
            <TableRow key={id}>
              <TableCell>{CityHelper.getCityCountryName(city)}</TableCell>
              <TableCell>{timezone}</TableCell>
              <TableCell>{formatInTimeZone(utc, timezone, "PPP p")}</TableCell>
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
