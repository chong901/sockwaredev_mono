import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatInTimeZone } from "date-fns-tz";
import { X } from "lucide-react";

interface TimezoneListProps {
  utc: Date;
  timezones: string[];
  onRemove: (timezone: string) => void;
}

export function TimezoneList({ utc, timezones, onRemove }: TimezoneListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Timezone</TableHead>
          <TableHead>Date & Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {timezones.map((timezone) => {
          return (
            <TableRow key={timezone}>
              <TableCell>{timezone}</TableCell>
              <TableCell>{formatInTimeZone(utc, timezone, "PPP p")}</TableCell>
              <TableCell>
                <Button variant="ghost" onClick={() => onRemove(timezone)}>
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
