import { useQuery } from '@tanstack/react-query'
import { getIngestionKeys } from '@features/apiSettings/api/apiKeysApi.js'
import { QUERY_KEYS } from '@app/config/constants.js'

export function useIngestionKeys() {
  return useQuery({
    queryKey: QUERY_KEYS.apiSettings,
    queryFn: getIngestionKeys,
  })
}
