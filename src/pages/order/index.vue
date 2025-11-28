<script setup lang="ts">
import { getOrderListApi } from '@/services/order'
import type { OrderData } from '@/types/order'
import { onHide, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { formatime } from '@/composables/formatime'
import { useSimulateStore } from '@/stores'

const items = ['全部', '待支付', '待服务', '已完成', '已取消']
const current = ref(0)
const orderList = ref<OrderData[]>([])
const simulateStore = useSimulateStore()

const getOrderList = async (current: string) => {
  try {
    const res = await getOrderListApi(current)
    orderList.value = res.data
  } catch (error) {
    console.log(error)
  }
  orderList.value.forEach((item, index) => {
    if (simulateStore.isSimulate(item.out_trade_no)) {
      orderList.value[index] = simulateStore.findSimulateData(item.out_trade_no) as OrderData
    }
  })
  if (current === '1') {
    orderList.value = orderList.value.filter(
      (item) => simulateStore.isSimulate(item.out_trade_no) === false,
    )
  }
  if (current === '2') {
    if (simulateStore.simulateData.find((item) => item.trade_state === '待服务')) {
      orderList.value.push(
        simulateStore.simulateData.find((item) => item.trade_state === '待服务') as OrderData,
      )
    }
  }
  if (current === '3') {
    if (simulateStore.simulateData.find((item) => item.trade_state === '已完成')) {
      orderList.value.push(
        simulateStore.simulateData.find((item) => item.trade_state === '已完成') as OrderData,
      )
    }
  }
}

const onClickItem = (e: any) => {
  current.value = e.currentIndex
  getOrderList(current.value.toString())
}

const goOrderDetail = (out_trade_no: string) => {
  uni.navigateTo({ url: `/pages/order/detail?out_trade_no=${out_trade_no}` })
}

onShow(() => {
  const app = getApp()
  current.value = app.globalData?.switchTab || 0
  getOrderList(current.value.toString())
})

onHide(() => {
  const app = getApp()
  if (app) {
    if (app.globalData) {
      app.globalData.switchTab = 0
    }
  }
})
</script>

<template>
  <view class="order-list-page">
    <view class="uni-padding-wrap">
      <uni-segmented-control
        :current="current"
        :values="items"
        style-type="text"
        active-color="#27ba9b"
        @clickItem="onClickItem"
      />
    </view>
    <view class="order-list" v-if="orderList.length > 0">
      <view
        class="order-item"
        v-for="order in orderList"
        :key="order.out_trade_no"
        @tap="goOrderDetail(order.out_trade_no)"
      >
        <view class="order-item-left">
          <image :src="order.service_logo_image_url" style="width: 100rpx; height: 100rpx" />
          <view class="item-text">
            <text style="font-weight: bold">{{ order.service_name }}</text>
            <text style="font-size: 20rpx; font-weight: lighter">{{ order.hospital_name }}</text>
            <text style="font-size: 20rpx; font-weight: lighter">{{
              formatime(order.order_start_time)
            }}</text>
          </view>
        </view>
        <view class="order-item-right">
          <view class="success" v-if="order.trade_state === '已完成'">
            <text>{{ order.trade_state }}</text>
          </view>
          <view class="warning" v-else-if="order.trade_state === '待支付'">
            <text>{{ order.trade_state }}</text>
            <view style="font-size: 24rpx">
              <counter
                v-if="order._exp_time && order._exp_time > 0"
                :second="order._exp_time"
                @counterOver="getOrderList(current.toString())"
              ></counter
            ></view>
          </view>
          <view class="help" v-else-if="order.trade_state === '待服务'">
            <text>{{ order.trade_state }}</text>
          </view>
          <view class="cancel" v-else-if="order.trade_state === '已取消'">
            <text>{{ order.trade_state }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="empty" v-else>
      <text>暂无订单</text>
      <view>-·-v-·-</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.order-list-page {
  .order-list {
    background-color: #f5f5f5;
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx;

    .order-item {
      height: 150rpx;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10rpx 40rpx;
      background-color: #fff;
      margin-bottom: 20rpx;
      .order-item-left {
        display: flex;
        align-items: center;
        img {
          width: 100rpx;
          height: 100rpx;
          border-radius: 50%;
        }
        .item-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-left: 10rpx;
          font-size: 28rpx;
          color: #333;
          text {
            margin-bottom: 5rpx;
          }
        }
      }
      .order-item-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
        font-size: 28rpx;
        color: #333;
        gap: 8rpx;

        .success {
          color: #27ba9b;
        }
        .warning {
          color: #ff9900;
          text-align: right;
        }
        .help {
          color: #0088ff;
        }
        .cancel {
          color: #ff3333;
        }
      }
    }
  }
  .empty {
    text-align: center;
    font-size: 36rpx;
    color: #999;
    margin-top: 50rpx;
  }
}
</style>
