import type { HomeDataResult } from '@/types/home'
import type { HospitalDataResult } from '@/types/hospital'
import { http } from '@/utils/http'

export const getHomeDataApi = (aid?: number) => {
  return http<HomeDataResult>({
    url: '/app/init',
    method: 'GET',
    data: {
      aid,
    },
  })
}

export const getHospitalDataApi = (aid: number, ssid?: string) => {
  return http<HospitalDataResult>({
    url: '/index/index',
    method: 'GET',
    data: {
      aid,
      ssid,
    },
  })
}
