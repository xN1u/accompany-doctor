<script setup lang="ts">
import { getAreasApi } from '@/services/areas'
import { useSimulateStore } from '@/stores'
import type { Area } from '@/types/home'
import { onShow } from '@dcloudio/uni-app'
import { onBeforeMount, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    background: string
    color: string
    fontsize: string
    iconWidth: string
    iconHeight: string
    title: string
    isHome: boolean
  }>(),
  {
    background: '#fff',
    color: '#000',
    fontsize: '32',
    iconWidth: '116',
    iconHeight: '38',
    title: '',
    isHome: false,
    opacity: 1,
  },
)

const statusHeight = ref(0)
const navHeight = ref(0)
const containerStyle = ref('')
const textStyle = ref('')
const iconStyle = ref('')
const pageLength = ref(0)
const capsuleStyle = ref('')
const area = ref<Area>()

const getSystemInfo = () => {
  const windowInfo = uni.getWindowInfo()
  statusHeight.value = windowInfo.statusBarHeight || 0

  const deviceInfo = uni.getDeviceInfo()
  if (deviceInfo.system?.indexOf('iOS') > -1) {
    navHeight.value = 88
  } else {
    navHeight.value = 96
  }
}

const setStyle = () => {
  containerStyle.value = [`background: ${props.background}`].join(';')
  textStyle.value = [`color: ${props.color}`, `font-size: ${props.fontsize}rpx`].join(';')
  iconStyle.value = [`width: ${props.iconWidth}rpx`, `height: ${props.iconHeight}rpx`].join(';')
}

const getCurrentPagesLength = () => {
  const pages = getCurrentPages()
  pageLength.value = pages.length
}

const getCapsuleButton = () => {
  // #ifdef MP-WEIXIN
  const res = uni.getMenuButtonBoundingClientRect()
  if (res) {
    capsuleStyle.value = `
      height: ${res.height * 2}rpx;
      line-height: ${res.height * 2}rpx;
      width: ${res.width * 2 + 96}rpx;
      margin-top: ${res.top * 2 - statusHeight.value}rpx;
      font-weight: lighter;
    `
  }
  // #endif

  // #ifdef H5
  capsuleStyle.value = `
    height: 80rpx;
    line-height: 80rpx;
    width: 200rpx;
    margin-top: 20rpx;
    font-weight: lighter;
  `
  // #endif
}

const backOrHome = () => {
  // #ifdef MP-WEIXIN
  if (pageLength.value > 1) {
    uni.navigateBack()
  } else {
    uni.switchTab({ url: '/pages/index/index' })
  }
  // #endif

  // #ifdef H5
  if (pageLength.value > 1) {
    window.history.back()
  } else {
    uni.navigateTo({ url: '/pages/index/index' })
  }
  // #endif
}

const initAreas = async () => {
  const simulateStore = useSimulateStore()
  if (simulateStore.selAid) {
    console.log('initAreas', simulateStore.selAid)
    const res = await getAreasApi(simulateStore.selAid)
    area.value = res.data.areas.find((item) => item.id === simulateStore.selAid) as Area
  }
}

const goSelectAreas = () => {
  uni.navigateTo({
    url: '/pages/areas/index',
  })
}

const emit = defineEmits<{
  (
    e: 'navBarAttached',
    params: {
      detail: {
        statusHeight: number
        navHeight: number
      }
    },
  ): void
}>()

onBeforeMount(() => {
  getSystemInfo()
  setStyle()
  getCurrentPagesLength()
  getCapsuleButton()
  emit('navBarAttached', {
    detail: {
      statusHeight: statusHeight.value,
      navHeight: navHeight.value,
    },
  })
})

onShow(() => {
  initAreas()
})
</script>

<template>
  <view class="nav">
    <view :style="'height:' + statusHeight + 'rpx;' + containerStyle"></view>
    <view class="home-bar" v-if="isHome">
      <view class="map-nav" @tap="goSelectAreas">
        <image
          src="@/static/resource/images/ic_city.png"
          style="width: 42rpx; height: 42rpx"
        ></image>
        <view
          class="title"
          :style="'height:' + navHeight + 'rpx;line-height:' + navHeight + 'rpx;' + textStyle"
          >{{ area?.name ? area.name : '中部地区' }}</view
        >
        <image src="@/static/resource/images/ic_arrow.png" style="width: 32rpx; height: 32rpx" />
      </view>
      <view class="search-nav">
        <navigator
          class="search"
          url="/pages/search/search"
          open-type="navigate"
          :style="capsuleStyle"
        >
          <image src="@/static/resource/images/ic_search.png" style="width: 32rpx; height: 32rpx" />
          <text>找医院</text>
        </navigator>
      </view>
    </view>
    <view class="nav-bar" :style="'height:' + navHeight + 'rpx;' + containerStyle" v-else>
      <view class="back-icon" @tap="backOrHome">
        <image src="@/static/resource/navbar/ic_back.png" v-if="pageLength > 1"></image>
        <image src="@/static/resource/navbar/ic_home.png" v-else></image>
      </view>
      <view
        class="title"
        v-if="title"
        :style="'height:' + navHeight + 'rpx;line-height:' + navHeight + 'rpx;' + textStyle"
        >{{ title }}</view
      >
    </view>
  </view>
</template>

<style scoped lang="scss">
.nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2;
  .nav-bar {
    position: relative;
    .back-icon {
      display: flex;
      align-items: center;
      width: 64rpx;
      height: 100%;
      margin-left: 20rpx;
      image {
        width: 64rpx;
        height: 64rpx;
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .home-bar {
    display: flex;
    align-items: center;
    .map-nav {
      display: flex;
      align-items: center;
      margin-left: 20rpx;
      .title {
        margin-left: 20rpx;
      }
    }
    .search-nav {
      flex: 1;
      margin-left: 20rpx;
      .search {
        background-color: #f4f4f4;
        border-radius: 200rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
