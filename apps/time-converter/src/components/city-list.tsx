import { useCities } from "@/components/store/city";
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
import { formatInTimeZone } from "date-fns-tz";
import { X } from "lucide-react";

interface TimezoneListProps {
  utc: Date;
}

export function CityList({ utc }: TimezoneListProps) {
  const { removeCity, selectedCities } = useCities();
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
