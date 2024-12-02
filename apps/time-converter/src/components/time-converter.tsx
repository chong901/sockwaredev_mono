"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fromZonedTime } from "date-fns-tz";
import { useState } from "react";
import { AddTimezone } from "./add-timezone";
import { DateTimePicker } from "./date-time-picker";
import { CityList } from "./timezone-list";

export function TimeConverter() {
  const [mainDateTime, setMainDateTime] = useState(new Date());
  const [mainTimezone, setMainTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [timezones, setTimezones] = useState([
    "America/New_York",
    "Europe/London",
    "Asia/Tokyo",
  ]);

  const handleAddTimezone = (newTimezone: string) => {
    if (!timezones.includes(newTimezone)) {
      setTimezones([...timezones, newTimezone]);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Time Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <DateTimePicker
          dateTime={mainDateTime}
          timezone={mainTimezone}
          onDateTimeChange={setMainDateTime}
          onTimezoneChange={setMainTimezone}
        />
        <CityList utc={fromZonedTime(mainDateTime, mainTimezone)} />
        <AddTimezone
          onAddTimezone={handleAddTimezone}
          selectedTimezones={timezones}
        />
      </CardContent>
    </Card>
  );
}
