import type { ServiceClientResult, ServiceResult } from '@/types/service'
import { http } from '@/utils/http'

export const getServiceListApi = (svid: number, ssid?: string, aid?: number) => {
  return http<ServiceResult>({
    url: '/Service/order',
    method: 'GET',
    data: {
      svid,
      ssid,
      aid,
    },
  })
}

export const getServiceClientListApi = () => {
  return http<ServiceClientResult>({
    url: '/User/clients',
    method: 'GET',
  })
}
