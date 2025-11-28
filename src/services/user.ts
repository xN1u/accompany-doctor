import type { UserInfoData } from '@/types/user'
import { http } from '@/utils/http'

export const getUserInfoDataApi = () => {
  return http<UserInfoData>({
    url: '/User/index',
    method: 'GET',
  })
}
