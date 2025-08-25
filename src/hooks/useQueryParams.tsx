import { DynamicKeyObject } from "@/interfaces/app";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export const useQueryParams = () => {
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const params: DynamicKeyObject = {};
    searchParams.forEach((value: string, key: string) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);
};
