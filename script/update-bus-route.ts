import "./env-loader";
// import env loader first

import { callLTAApi } from "@/app/api/(utils)/ltaUtil";
import { db } from "@/db/db";
import { BusRoute, BusRouteModel } from "@/db/schema/BusRoute";

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
  });
  console.log("Bus routes updated");
  process.exit(0);
};

main();
