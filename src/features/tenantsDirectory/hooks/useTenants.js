import { QUERY_KEYS } from "@app/config/constants";
import { useQuery } from "@tanstack/react-query";
import { fetchTenants } from "../api/tenantsApi";

export function useTenants(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.tenantsLookup, params],
    queryFn: () => fetchTenants(params),
  })
}
