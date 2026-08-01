import { QUERY_KEYS } from "@app/config/constants"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createApiKey, fetchApiKeys } from "../api/apiKeysApi"
import toast from "react-hot-toast"

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
    onError: () => {
      toast.error('Failed to generate API key')
    },
  })
}