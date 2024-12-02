"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fromZonedTime } from "date-fns-tz";
import { useState } from "react";
import { AddCity } from "./add-city";
import { CityList } from "./city-list";
import { DateTimePicker } from "./date-time-picker";

export function TimeConverter() {
  const [mainDateTime, setMainDateTime] = useState(new Date());
  const [mainTimezone, setMainTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

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
        <AddCity />
      </CardContent>
    </Card>
  );
}
