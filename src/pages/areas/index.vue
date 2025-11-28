<script setup lang="ts">
import { getAreasApi } from '@/services/areas'
import { useSimulateStore } from '@/stores'
import type { Area } from '@/types/areas'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const areasList = ref<Area[]>([])
const selectId = ref(0)
const simulateStore = useSimulateStore()

const getAreaList = async () => {
  const res = await getAreasApi()
  areasList.value = res.data.areas
  selectId.value = simulateStore.selAid
}

const selectChange = (id: number) => {
  selectId.value = id
  simulateStore.setSelAid(id)
  uni.switchTab({ url: '/pages/index/index' })
}

onLoad(() => {
  getAreaList()
})
</script>

<template>
  <view class="areas-page">
    <view class="areas-container" v-for="areas in areasList" :key="areas.id">
      <view class="left">
        <text style="font-weight: bold">{{ areas.name }}</text>
      </view>
      <view class="right">
        <button
          :class="'btnp' + (selectId === areas.id ? ' btnp-disabled' : '')"
          :disabled="selectId === areas.id"
          @click="selectChange(areas.id)"
          style="color: #27ba9b; border: 1px solid #27ba9b"
        >
          选择
        </button>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.areas-page {
  height: 100vh;
  width: 100%;
  background-color: #eee;
  padding: 20rpx 0;
  .areas-container {
    display: flex;
    height: 150rpx;
    width: 90%;
    background-color: #fff;
    margin: 0 auto;
    padding: 0 20rpx;
    align-items: center;
    margin-bottom: 20rpx;
    border-radius: 20rpx;

    .right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      button {
        margin: 0;
        height: 80rpx;
        line-height: 80rpx;
        background: #fff;
        font-size: 28rpx;
        transition: all 0.2s ease;
      }
    }
  }
}
</style>
