import CitySelect from "@/components/city-select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface DateTimePickerProps {
  dateTime: Date;
  timezone: string;
  onDateTimeChange: (date: Date) => void;
  onTimezoneChange: (timezone: string) => void;
}

export function DateTimePicker({
  dateTime,
  timezone,
  onDateTimeChange,
  onTimezoneChange,
}: DateTimePickerProps) {
  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const newDateTime = new Date(dateTime);
      newDateTime.setFullYear(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate(),
      );
      onDateTimeChange(newDateTime);
    }
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = event.target.value.split(":").map(Number);
    const newDateTime = new Date(dateTime);
    newDateTime.setHours(hours!);
    newDateTime.setMinutes(minutes!);
    onDateTimeChange(newDateTime);
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateTime && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateTime ? format(dateTime, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateTime}
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="time">Time</Label>
        <Input
          id="time"
          type="time"
          value={format(dateTime, "HH:mm")}
          onChange={handleTimeChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="timezone">Timezone</Label>
        <CitySelect
          onSelect={(city) => onTimezoneChange(city.timezone)}
          buttonText={timezone}
        />
      </div>
    </div>
  );
}
