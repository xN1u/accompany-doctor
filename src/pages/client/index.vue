<script setup lang="ts">
import { getServiceClientListApi } from '@/services/service'
import type { ServiceClient } from '@/types/service'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const clientList = ref<ServiceClient[]>([])
const isSelect = ref(false)
const selectId = ref(0)

const selectChange = (id: number) => {
  const client = clientList.value.find((item) => item.id === id)
  if (client) {
    uni.$emit('clientSelectChange', client)
    uni.navigateBack()
  }
}

const deleteClient = () => {
  uni.showToast({
    title: '该功能暂未开放',
    icon: 'none',
    duration: 1000,
  })
}

onLoad(async (option) => {
  const res = await getServiceClientListApi()
  clientList.value = res.data.clients
  isSelect.value = option?.isSelect
  selectId.value = parseInt(option?.selectId) || 0
  console.log(option, selectId.value)
})
</script>

<template>
  <view class="client-page">
    <view class="client-container" v-for="client in clientList" :key="client.id">
      <view class="left">
        <text style="font-weight: bold">{{ client.name }}</text>
        <view>
          <text v-if="client.sex === 1" style="font-weight: lighter; color: #27ba9b">男</text>
          <text v-else-if="client.sex === 2" style="font-weight: lighter; color: #f5a623">女</text>
          <text v-else style="font-weight: lighter; color: #9eadd3">未知</text>
          <text style="margin-left: 20rpx; font-weight: lighter">{{ client.age }}岁</text>
          <text style="margin-left: 20rpx; font-weight: lighter">{{ client.mobile }}</text>
        </view>
      </view>
      <view class="right">
        <button
          v-if="isSelect === true"
          :class="'btnp' + (selectId === client.id ? ' btnp-disabled' : '')"
          :disabled="selectId === client.id"
          @click="selectChange(client.id)"
          style="color: #27ba9b; border: 1px solid #27ba9b"
        >
          选择
        </button>
        <button v-else class="del-btn" @click="deleteClient">删除</button>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.client-page {
  height: 100vh;
  width: 100%;
  background-color: #eee;
  padding: 20rpx 0;
  .client-container {
    display: flex;
    height: 150rpx;
    width: 90%;
    background-color: #fff;
    margin: 0 auto;
    padding: 0 20rpx;
    align-items: center;
    margin-bottom: 20rpx;

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

        &:not(:disabled):hover,
        &:not(:disabled):active {
          transform: scale(0.95);
          opacity: 0.9;
        }
      }
      .del-btn {
        color: #f5a623;
        border: 1px solid #f5a623;
      }
    }
  }
}
</style>
