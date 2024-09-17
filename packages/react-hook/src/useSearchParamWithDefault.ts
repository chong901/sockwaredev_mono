import { useSearchParams } from "next/navigation";

export const useSearchParamWithDefault = (
  key: string,
  defaultValue: string,
) => {
  const searchParam = useSearchParams();
  return searchParam.get(key) ?? defaultValue;
};
