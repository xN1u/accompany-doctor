import { getOrderDetailApi } from '@/services/order'
import type { OrderDetailData } from '@/types/order'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSimulateStore = defineStore('simulate', () => {
  const simulateId = ref<string[]>([])
  const simulateData = ref<OrderDetailData[]>([])
  const selAid = ref<number>(1)

  const setSimulateId = (id: string) => {
    simulateId.value.push(id)
  }

  const isSimulate = (id: string) => {
    return simulateId.value.includes(id)
  }

  const setSimulateData = async (id: string) => {
    const res = await getOrderDetailApi(id)
    res.data.paidPrice = res.data.price
    res.data.trade_state = '待服务'
    res.data.pay_time = Math.floor(Date.now() / 1000)
    simulateData.value.push(res.data)
  }

  const completeSimulateData = (id: string) => {
    const index = simulateData.value.findIndex((item) => item.out_trade_no === id)
    simulateData.value[index].trade_state = '已完成'
  }

  const findSimulateData = (id: string) => {
    return simulateData.value.find((item) => item.out_trade_no === id)
  }

  const setSelAid = (id: number) => {
    selAid.value = id
  }

  return {
    setSimulateId,
    isSimulate,
    setSimulateData,
    simulateData,
    findSimulateData,
    completeSimulateData,
    selAid,
    setSelAid,
  }
})
