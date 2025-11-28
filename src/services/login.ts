import type { LoginResult } from '@/types/user'
import { http } from '@/utils/http'

export const loginApi = (code: string) => {
  return http<LoginResult>({
    url: '/auth/wxLogin',
    method: 'GET',
    data: {
      code,
    },
  })
}

export const getMobileLoginCodeApi = (tel: string) => {
  return http({
    url: '/get/code',
    method: 'POST',
    data: {
      tel,
    },
  })
}

export const mobileLoginApi = (tel: string, code: string) => {
  return http<{ token: string }>({
    url: '/user/authentication',
    method: 'POST',
    data: {
      tel,
      code,
    },
  })
}
