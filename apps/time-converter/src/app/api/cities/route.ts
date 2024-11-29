import { CityService } from "@/app/api/(modules)/city/city.service";
import { GetCitiesResponse } from "@/types/api/cities";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  return Response.json({
    data: await CityService.fetchCitiesBySearch(
      req.nextUrl.searchParams.get("search") ?? "",
    ),
  } as GetCitiesResponse);
};
