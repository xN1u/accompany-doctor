<script setup lang="ts">
import { getHospitalDetailApi } from '@/services/hospital'
import type { HospitalDetail, HospitalDetailData, HospitalService } from '@/types/hospital'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const hid = ref<string>('')
const hospitalDetail = ref<HospitalDetail>()
const hospitalDetailData = ref<HospitalDetailData>()
const serviceList = ref<HospitalService[]>()
const navHeight = ref<number>(0)
const shareRef = ref<any>()

const getHospitalDetail = async (hid: string) => {
  const res = await getHospitalDetailApi(hid)
  console.log(res)
  hospitalDetail.value = res.data
  hospitalDetailData.value = res.data.hospital
  serviceList.value = res.data.services
}

const onNavBarAttached = (e: any) => {
  navHeight.value = e.detail.navHeight
}

const goService = (svid: string, hid: string) => {
  uni.navigateTo({
    url: `/pages/service/index?svid=${svid}&hid=${hid}`,
  })
}

const onShareAppMessage = () => {
  return {
    title: `${hospitalDetailData.value?.rank || ''}${hospitalDetailData.value?.name} 邀你查看`,
    path: `/pages/hospitalDetail/hospitalDetail?id=${hid.value}`,
    imageUrl: hospitalDetailData.value?.avatar_url || '/static/resource/images/default-share.png',
    success: (res: any) => {
      console.log('转发成功', res)
      uni.showToast({ title: '转发成功' })
      shareRef.value.close()
    },
    fail: (err: any) => {
      console.log('转发失败', err)
      uni.showToast({ title: '转发失败', icon: 'none' })
    },
  }
}

onLoad((option) => {
  // console.log(option)
  hid.value = option?.hid
  getHospitalDetail(hid.value)
})
</script>

<template>
  <view
    class="hospital-detail-page"
    :style="`--bg-url: url(${
      hospitalDetailData?.avatar_url || '@/static/resource/images/default-bg.png'
    })`"
  >
    <navbar @navBarAttached="onNavBarAttached" :background="'rgba(255,255,255,0)'"></navbar>
    <view v-if="hospitalDetailData?.id" class="no-empty">
      <view class="hospital-dsc" :style="`margin-top: ${navHeight + 50}rpx`">
        <image :src="hospitalDetailData?.avatar_url" />
        <view class="hospital-content">
          <view style="font-size: 32rpx; font-weight: bold; color: #fff; margin-bottom: 30rpx">{{
            hospitalDetailData?.name
          }}</view>
          <view style="font-size: 26rpx; font-weight: bold; color: #27ba9b"
            >{{ hospitalDetailData?.rank }}&nbsp;{{ hospitalDetailData?.label }}</view
          >
        </view>
      </view>
      <view class="hospital-info" :style="`margin-top: ${navHeight}rpx`">
        <view class="hospital-address" :style="`margin-top: ${navHeight + 110}rpx`">
          <view
            style="
              display: flex;
              justify-content: flex-end;
              border-bottom: 1px solid #ccc;
              padding: 20rpx 0;
            "
            @tap="shareRef.open()"
          >
            转发
            <image
              src="@/static/resource/images/ic_arrow.png"
              style="width: 30rpx; height: 30rpx"
            />
          </view>
          <uni-popup
            ref="shareRef"
            type="bottom"
            safeArea
            backgroundColor="#eee"
            borderRadius="20rpx 20rpx 0 0"
          >
            <view class="share-container">
              <view class="title">
                <text>转发分享</text>
              </view>
              <view class="icon">
                <view class="content">
                  <button
                    style="
                      border: none !important;
                      padding: 0 !important;
                      margin: 0 !important;
                      width: auto !important;
                    "
                  >
                    <view class="ic">
                      <image src="@/static/resource/images/push_wx.png"></image>
                    </view>
                  </button>
                  <text>发送给微信好友</text>
                </view>
                <view class="content">
                  <button
                    open-type="share"
                    style="
                      border: none !important;
                      padding: 0 !important;
                      margin: 0 !important;
                      width: auto !important;
                    "
                  >
                    <view class="ic">
                      <image src="@/static/resource/images/push_img.png"></image>
                    </view>
                  </button>
                  <text>生成分享图片</text>
                </view>
              </view>
              <view class="btn">
                <button @click="shareRef.close()">取消</button>
              </view>
            </view>
          </uni-popup>
          <view class="address">
            <image
              src="@/static/resource/images/ic_loc.png"
              style="width: 30rpx; height: 30rpx"
            ></image>
            {{ hospitalDetailData?.address }}
            <view class="right">
              导航
              <image
                src="@/static/resource/images/ic_arrow.png"
                style="width: 30rpx; height: 30rpx"
              />
            </view>
          </view>
        </view>
      </view>
      <view class="service-list">
        <view class="title">在线预约您需要的服务</view>
        <view class="service-item" v-for="service in serviceList" :key="service.id">
          <view class="left">
            <image
              :src="service.icon_image_url"
              style="width: 150rpx; height: 150rpx; border-radius: 24rpx"
            />
            <view class="service-text">
              <text style="font-weight: bold">{{ service.name }}</text>
              <text style="font-size: 24rpx; font-weight: lighter; color: #999">{{
                service.intro
              }}</text>
              <text style="color: #27ba9b; font-size: 24rpx"
                ><text style="font-weight: bold; font-size: 36rpx">{{ service.price }}</text
                >元/次</text
              >
            </view>
          </view>
          <view class="right">
            <button @click="goService(service.id.toString(), hid)">预约</button>
          </view>
        </view>
      </view>
    </view>
    <view class="empty" v-else :style="`margin-top: ${navHeight + 150}rpx`">
      <text>该医院暂未开通，请选择其他医院</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.hospital-detail-page {
  .no-empty {
    padding: 10rpx 20rpx;
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      background-color: #eee;
      background-image: var(--bg-url),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0));
      background-repeat: no-repeat;
      background-size: 100% 50%;
      filter: blur(48rpx);
      -webkit-filter: blur(48rpx);
    }
    .hospital-dsc {
      display: flex;
      align-items: center;
      position: absolute;
      margin-left: 20rpx;
      image {
        height: 130rpx;
        width: 150rpx;
        border-radius: 24rpx;
      }
      .hospital-content {
        margin-left: 20rpx;
        display: flex;
        flex-direction: column;
      }
    }
    .hospital-info {
      .hospital-address {
        background-color: #fff;
        padding: 0 20rpx;
        border-radius: 20rpx;
        color: #999;
        font-weight: lighter;
        .address {
          display: flex;
          padding: 20rpx 0;
          .right {
            flex: 1;
            display: flex;
            justify-content: flex-end;
          }
        }
      }
    }
    .service-list {
      margin-top: 20rpx;
      background-color: #fff;
      border-radius: 20rpx;
      width: 100%;
      .title {
        font-size: 36rpx;
        font-weight: bold;
        padding: 20rpx;
      }
      .service-item {
        display: flex;
        padding: 20rpx;
        .left {
          display: flex;
          align-items: center;
          flex: 3;
          .service-text {
            display: flex;
            flex-direction: column;
            margin-left: 20rpx;
            overflow: hidden;
            text {
              margin-bottom: 10rpx;
            }
          }
        }
        .right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          button {
            width: 120rpx;
            height: 60rpx;
            border-radius: 10rpx;
            background-color: #27ba9b;
            color: #fff;
            font-size: 24rpx;
            font-weight: bold;
            text-align: center;
            line-height: 60rpx;
          }
        }
      }
    }
  }
  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    text {
      font-size: 36rpx;
      font-weight: bold;
      color: #999;
    }
  }
}
.share-container {
  height: 400rpx;
  width: 100%;
  padding: 20rpx;
  .title {
    color: #000;
    font-size: 36rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon {
    margin-top: 40rpx;
    display: flex;
    justify-content: space-around;
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text {
        margin-top: 20rpx;
        font-size: 22rpx;
        color: #000;
      }
      .ic {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 120rpx;
        height: 120rpx;
        background-color: #fff;
        image {
          width: 60rpx;
          height: 60rpx;
        }
      }
    }
  }
  .btn {
    margin-top: 20rpx;
    button {
      border-radius: 44rpx;
    }
  }
}
</style>
