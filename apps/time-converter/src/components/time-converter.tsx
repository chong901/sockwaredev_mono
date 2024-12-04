"use client";

import { useMainTime } from "@/components/store/timezone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fromZonedTime } from "date-fns-tz";
import { AddCity } from "./add-city";
import { CityList } from "./city-list";
import { DateTimePicker } from "./date-time-picker";

export function TimeConverter() {
  const { mainDateTime, mainTimezone, setMainDateTime, setMainTimezone } =
    useMainTime();

  return (
    <Card className="mx-auto w-full">
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
