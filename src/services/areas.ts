import { http } from '@/utils/http'
import type { AreasResult } from '@/types/areas'

export const getAreasApi = (aid?: number) => {
  return http<AreasResult>({
    url: '/index/areas',
    method: 'GET',
    data: {
      aid,
    },
  })
}
