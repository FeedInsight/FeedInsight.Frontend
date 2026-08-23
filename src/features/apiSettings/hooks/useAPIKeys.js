import { QUERY_KEYS } from "@app/config/constants"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createApiKey, fetchApiKeys, revokeApiKey } from "../api/apiKeysApi"

export function useApiKeys() {
  return useQuery({
    queryKey: QUERY_KEYS.apiSettings,
    queryFn: fetchApiKeys,
  })
}

export function useCreateApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.apiSettings })
    },
  })
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: revokeApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.apiSettings })
    },
  })
}