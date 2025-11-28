<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    currentStep: number
  }>(),
  {
    currentStep: 1,
  },
)

const progressWidth = computed(() => `${(props.currentStep / 4) * 100}%`)
</script>

<template>
  <view class="progress-section">
    <view class="progress-bg">
      <view class="progress-bar" v-if="currentStep === 0" :style="{ width: progressWidth }"></view>
      <view class="progress-bar" v-else :style="{ width: progressWidth }"></view>
    </view>
    <view class="step-list">
      <view class="step-item" :class="{ active: currentStep === 1 }">填写订单</view>
      <view class="step-item" :class="{ active: currentStep === 2 }">在线支付</view>
      <view class="step-item" :class="{ active: currentStep === 3 }">专人服务</view>
      <view class="step-item" :class="{ active: currentStep === 4 }">服务完成</view>
    </view>
  </view>
</template>
<style scoped lang="scss">
.progress-section {
  height: 200rpx;
  background: url('@/static/resource/images/od_bg_icon.png') no-repeat right,
    linear-gradient(to right, rgba(39, 186, 155, 0.8), rgba(39, 186, 155, 1));
  padding: 80rpx 30rpx;
  .progress-bg {
    height: 20rpx;
    background-color: #e5e5e5;
    border-radius: 200rpx;
    overflow: hidden;

    .progress-bar {
      height: 20rpx;
      background: linear-gradient(to right, #28a745, #00bfa5);
      border-radius: 200px;
      transition: width 0.3s ease;
    }
  }

  .step-list {
    display: flex;
    justify-content: space-between;
    margin-top: 20rpx;

    .step-item {
      font-size: 28rpx;
      color: #333;

      &.active {
        color: #fff;
        font-weight: bold;
      }
    }
  }
}
</style>
