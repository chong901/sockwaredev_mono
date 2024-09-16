import "./env-loader";
// import env loader first

import { callLTAApi } from "@/app/api/(utils)/ltaUtil";
import { db } from "@/db/db";
import { BusRoute, BusRouteModel } from "@/db/schema/BusRoute";

const missingBusRoutes: BusRoute[] = [
  {
    ServiceNo: "195",
    Operator: "SBST",
    Direction: 1,
    StopSequence: 1,
    BusStopCode: "02099",
    Distance: 0.0,
    WD_FirstBus: "0600",
    WD_LastBus: "2330",
    SAT_FirstBus: "0600",
    SAT_LastBus: "2330",
    SUN_FirstBus: "0600",
    SUN_LastBus: "2330",
  },
  {
    ServiceNo: "56",
    Operator: "SBST",
    Direction: 2,
    StopSequence: 1,
    BusStopCode: "02099",
    Distance: 0.0,
    WD_FirstBus: "0600",
    WD_LastBus: "2345",
    SAT_FirstBus: "0600",
    SAT_LastBus: "0015",
    SUN_FirstBus: "0600",
    SUN_LastBus: "2345",
  },
  {
    ServiceNo: "77",
    Operator: "TTS",
    Direction: 2,
    StopSequence: 1,
    BusStopCode: "02099",
    Distance: 0.0,
    WD_FirstBus: "0628",
    WD_LastBus: "2328",
    SAT_FirstBus: "0628",
    SAT_LastBus: "2328",
    SUN_FirstBus: "0628",
    SUN_LastBus: "2328",
  },
  {
    ServiceNo: "960",
    Operator: "SMRT",
    Direction: 2,
    StopSequence: 1,
    BusStopCode: "02099",
    Distance: 0.0,
    WD_FirstBus: "0630",
    WD_LastBus: "2330",
    SAT_FirstBus: "0630",
    SAT_LastBus: "2330",
    SUN_FirstBus: "0645",
    SUN_LastBus: "2330",
  },
  {
    ServiceNo: "960e",
    Operator: "SMRT",
    Direction: 2,
    StopSequence: 1,
    BusStopCode: "02099",
    Distance: 0.0,
    WD_FirstBus: "1400",
    WD_LastBus: "2230",
    SAT_FirstBus: "1400",
    SAT_LastBus: "2300",
    SUN_FirstBus: "1400",
    SUN_LastBus: "2300",
  },
  {
    ServiceNo: "97",
    Operator: "TTS",
    Direction: 2,
    StopSequence: 1,
    BusStopCode: "02099",
    Distance: 0.0,
    WD_FirstBus: "0558",
    WD_LastBus: "2348",
    SAT_FirstBus: "0558",
    SAT_LastBus: "2348",
    SUN_FirstBus: "0558",
    SUN_LastBus: "2348",
  },
  {
    ServiceNo: "97e",
    Operator: "TTS",
    Direction: 2,
    StopSequence: 1,
    BusStopCode: "02099",
    Distance: 0.0,
    WD_FirstBus: "1806",
    WD_LastBus: "1854",
    SAT_FirstBus: "-",
    SAT_LastBus: "-",
    SUN_FirstBus: "-",
    SUN_LastBus: "-",
  },
];

const main = async () => {
  const url = "https://datamall2.mytransport.sg/ltaodataservice/BusRoutes";
  let response = await callLTAApi<{ value: BusRoute[] }>(url);
  let skip = 0;
  await db.transaction(async (tx) => {
    await tx.delete(BusRouteModel);
    while (response.value.length > 0) {
      await tx.insert(BusRouteModel).values(response.value);
      skip += response.value.length;
      response = await callLTAApi<{ value: BusRoute[] }>(
        `${url}?$skip=${skip}`,
      );
    }
    await tx.insert(BusRouteModel).values(missingBusRoutes);
  });
  console.log("Bus routes updated");
  process.exit(0);
};

main();
