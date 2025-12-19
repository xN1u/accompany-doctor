<script setup lang="ts">
import { computed, ref } from 'vue'
import { getUserInfoDataApi } from '@/services/user'
import type { Mine, Statistic, UserInfoData } from '@/types/user'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores'

const userInfo = ref<UserInfoData>()
const mineData = ref<Mine>()
const statisticData = ref<Statistic>()
const userStore = useUserStore()
const token = computed(() => userStore.token || '')

const getUserInfoData = async () => {
  const res = await getUserInfoDataApi()
  userInfo.value = res.data
  mineData.value = res.data.mine
  statisticData.value = res.data.statistic
  console.log(res)
}

const goOrderList = (index: number) => {
  const app = getApp()
  if (app) {
    if (app.globalData) {
      app.globalData.switchTab = index
    }
  }
  uni.switchTab({
    url: `/pages/order/index`,
  })
}

const goClient = () => {
  uni.navigateTo({
    url: `/pages/client/index?isSelect=${false}`,
  })
}

const goArea = () => {
  uni.navigateTo({
    url: `/pages/areas/index`,
  })
}

const goToLogin = () => {
  uni.navigateTo({
    url: `/pages/login/index?isSwitch=${true}`,
  })
}

onShow(() => {
  getUserInfoData()
})
</script>

<template>
  <view class="my-page">
    <view v-if="token">
      <view class="my-info">
        <image class="avatar" :src="mineData?.avatar_url" />
        <text class="name">{{ mineData?.nickname }}</text>
      </view>
      <view class="my-order">
        <view class="nav">
          <text>我的订单</text>
          <text style="color: #999" @tap="goOrderList(0)">全部</text>
        </view>
        <view class="list">
          <view class="item" @tap="goOrderList(1)">
            <uni-badge
              class="uni-badge-left-margin"
              :text="
                statisticData?.topays && statisticData?.topays > 0
                  ? statisticData.topays.toString()
                  : undefined
              "
              absolute="rightTop"
              size="small"
            >
              <image src="@/static/resource/images/od_10.png"></image>
            </uni-badge>
            <text style="color: #999; padding: 20rpx 0">待支付</text>
          </view>
          <view class="item" @tap="goOrderList(2)">
            <uni-badge
              class="uni-badge-left-margin"
              :text="
                statisticData?.todos && statisticData?.todos > 0
                  ? statisticData.todos.toString()
                  : undefined
              "
              absolute="rightTop"
              size="small"
            >
              <image src="@/static/resource/images/od_20.png"></image>
            </uni-badge>
            <text style="color: #999; padding: 20rpx 0">待服务</text>
          </view>
          <view class="item" @tap="goOrderList(3)">
            <image src="@/static/resource/images/od_30.png"></image>
            <text style="color: #999; padding: 20rpx 0">已完成</text>
          </view>
          <view class="item" @tap="goOrderList(4)">
            <image src="@/static/resource/images/od_40.png"></image>
            <text style="color: #999; padding: 20rpx 0">已取消</text>
          </view>
        </view>
      </view>
      <view class="my-management">
        <view class="item" @tap="goClient">
          <view class="left">
            <image
              src="@/static/resource/images/ic_clients.png"
              style="width: 50rpx; height: 50rpx"
            ></image>
            <text style="color: #999; margin-left: 20rpx">服务对象管理</text>
          </view>
          <view class="right">
            <image
              src="@/static/resource/images/ic_arrow.png"
              style="width: 30rpx; height: 30rpx"
            />
          </view>
        </view>
        <view class="item" @tap="goArea">
          <view class="left">
            <image
              src="@/static/resource/images/ic_address.png"
              style="width: 50rpx; height: 50rpx"
            ></image>
            <text style="color: #999; margin-left: 20rpx">区域管理</text>
          </view>
          <view class="right">
            <image
              src="@/static/resource/images/ic_arrow.png"
              style="width: 30rpx; height: 30rpx"
            />
          </view>
        </view>
      </view>
    </view>
    <view v-else class="empty">
      <view class="tip-text">
        <view class="tip-title">请先登录</view>
        <view class="tip-desc">登录后可享受完整功能，快去登录吧～</view>
      </view>
      <view class="btn-group">
        <button class="btnp" @tap="goToLogin">去登录</button>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.my-page {
  background-color: #f5f5f5;
  height: 100vh;
  padding: 20rpx;
  .my-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    min-height: 300rpx;
    margin-bottom: 20rpx;
    .avatar {
      height: 100rpx;
      width: 100rpx;
    }
  }
  .my-order {
    background-color: #fff;
    margin-bottom: 20rpx;
    .nav {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 40rpx 20rpx;
      border-bottom: 1px solid #eee;
    }
    .list {
      display: flex;
      justify-content: space-between;
      padding: 20rpx 40rpx;
      .item {
        display: flex;
        flex-direction: column;
        image {
          width: 80rpx;
          height: 80rpx;
        }
      }
    }
  }
  .my-management {
    background-color: #fff;
    margin-bottom: 20rpx;
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx;
      border-bottom: 1px solid #eee;
      .left {
        display: flex;
        align-items: center;
      }
    }
  }
  .empty {
    margin-top: 130rpx;
    .tip-text {
      text-align: center;
      margin-bottom: 60rpx;
    }

    .tip-title {
      font-size: 36rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 16rpx;
    }

    .tip-desc {
      font-size: 28rpx;
      color: #666;
      line-height: 1.5;
    }

    .btn-group {
      width: 100%;
      display: flex;
      gap: 24rpx;
      justify-content: center;
    }
  }
}
</style>
