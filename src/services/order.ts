import type { OrderDetailData, OrderBodyData, OrderData } from '@/types/order'
import { http } from '@/utils/http'

export const createOrderApi = (data: OrderBodyData) => {
  return http({
    url: '/pay/createOrder',
    method: 'POST',
    data,
  })
}

export const getOrderListApi = (state: string) => {
  return http<OrderData[]>({
    url: '/order/list',
    method: 'GET',
    data: {
      state,
    },
  })
}

export const getOrderDetailApi = (oid: string) => {
  return http<OrderDetailData>({
    url: '/order/detail',
    method: 'GET',
    data: {
      oid,
    },
  })
}
