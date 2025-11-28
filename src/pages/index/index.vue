<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useSimulateStore, useUserStore } from '@/stores'
import { getHomeDataApi, getHospitalDataApi } from '@/services/home'
import { ref } from 'vue'
import type { HospitalData, Nav, Slide } from '@/types/hospital'

const useUser = useUserStore()
const aid = ref(1)
const slides = ref<Slide[]>()
const nav1 = ref<Nav[]>()
const nav2 = ref<Nav[]>()
const hospitals = ref<HospitalData[]>()
const simulateStore = useSimulateStore()

const initHome = async () => {
  const selAid = simulateStore.selAid || 1
  const res = await getHomeDataApi(selAid)
  aid.value = res.data.area.id
  const { data } = await getHospitalDataApi(aid.value)
  slides.value = data.slides.length > 0 ? data.slides : slides.value
  nav1.value = data.navs.length > 0 ? data.navs : nav1.value
  nav2.value = data.nav2s.length > 0 ? data.nav2s : nav2.value
  hospitals.value = data.hospitals.length > 0 ? data.hospitals : hospitals.value
}

const goHospitalDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/hospital/index?hid=${id}`,
  })
}

onShow(() => {
  initHome()
})
</script>

<template>
  <navbar :isHome="true"></navbar>
  <view class="index" style="margin-top: 130rpx">
    <swiper class="swiper" circular :autoplay="true">
      <swiper-item class="swiper-item" v-for="slide in slides" :key="slide.id">
        <image :src="slide.pic_image_url || '@/static/images/warn.png'" />
      </swiper-item>
    </swiper>
    <view class="nav2">
      <navigator v-for="nav in nav2" :key="nav.id" :url="nav.stype_link" open-type="navigate">
        <image :src="nav.pic_image_url" />
      </navigator>
    </view>
    <view class="nav1">
      <navigator v-for="nav in nav1" :key="nav.id" :url="nav.stype_link" open-type="navigate">
        <image :src="nav.pic_image_url" />
        <text class="nav-text">{{ nav.title }}</text>
      </navigator>
    </view>
    <view class="hospital">
      <uni-list :border="true">
        <uni-list-item
          v-for="hospital in hospitals"
          :key="hospital.id"
          direction="row"
          clickable
          @click="goHospitalDetail(hospital.id)"
        >
          <template v-slot:header>
            <view class="slot-box">
              <image class="slot-image" :src="hospital.avatar_url"></image>
            </view>
          </template>
          <template v-slot:body>
            <view class="slot-container">
              <text class="slot-title">{{ hospital.name }}</text>
              <text class="slot-tag">{{ hospital.rank }} {{ hospital.label }}</text>
              <text class="slot-intro">{{ hospital.intro }}</text>
            </view>
          </template>
        </uni-list-item>
      </uni-list>
    </view>
  </view>
</template>

<style lang="scss">
.index {
  width: 90%;
  margin: 0 auto;
  .swiper {
    height: 300rpx;
    padding: 20rpx 0;
    border-radius: 40rpx;
  }
  .nav2 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 200rpx;
    navigator {
      height: 100%;
      width: 48%;
      image {
        width: 100%;
        height: 100%;
        border-radius: 20rpx;
      }
    }
  }
  .nav1 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 140rpx;
    padding: 20rpx 0;
    navigator {
      height: 100%;
      width: 15%;
      .nav-text {
        font-size: 24rpx;
      }
    }
  }
  .hospital {
    margin-top: 40rpx;
    uni-list {
      uni-list-item {
        .slot-box {
          flex: 0 0 30%;
          height: 180rpx;
          image {
            border-radius: 20rpx;
          }
        }
        .slot-container {
          display: flex;
          flex-direction: column;
          margin-left: 20rpx;
          .slot-title {
            font-size: 28rpx;
            font-weight: bold;
            margin-bottom: 10rpx;
          }
          .slot-tag {
            font-size: 24rpx;
            font-weight: bold;
            color: #739e9d;
            margin-bottom: 10rpx;
          }
          .slot-intro {
            font-size: 20rpx;
            color: #666;
          }
        }
      }
    }
  }
}
</style>
