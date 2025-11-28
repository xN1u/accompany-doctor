import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义 Store
export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref<string | null>(null)

    const setToken = (val: string) => {
      token.value = val
    }

    const clearToken = () => {
      token.value = null
    }

    return {
      token,
      setToken,
      clearToken,
    }
  },
  // TODO: 持久化
  {
    persist: {
      storage: {
        getItem: (key: string) => {
          return uni.getStorageSync(key)
        },
        setItem: (key: string, value: any) => {
          uni.setStorageSync(key, value)
        },
      },
    },
  },
)
