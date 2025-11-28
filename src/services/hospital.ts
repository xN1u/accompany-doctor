import type { HospitalDetail } from '@/types/hospital'
import { http } from '@/utils/http'

export const getHospitalDetailApi = (hid: string) => {
  return http<HospitalDetail>({
    url: '/Hospital/index',
    method: 'GET',
    data: {
      hid,
    },
  })
}
