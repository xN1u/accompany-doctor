<script setup>
import { ref } from 'vue'
import UQRCode from 'uqrcodejs'
import { useSimulateStore } from '@/stores'

const oid = ref('')

const qrcodePopup = ref(null)

const payment = () => {
  uni.switchTab({ url: '/pages/order/index' })
  qrcodePopup.value.close()
}

const openDialog = (urlData, id) => {
  if (id) {
    oid.value = id
  }
  console.log('openDialog')
  qrcodePopup.value.open('center')
  // 获取uQRCode实例
  const qr = new UQRCode()
  // 设置二维码内容
  qr.data = urlData
  // 设置二维码大小，必须与canvas设置的宽高一致
  qr.size = 150
  // 调用制作二维码方法
  qr.make()
  // 获取canvas上下文
  var canvasContext = uni.createCanvasContext('qrcode')
  // 设置uQRCode实例的canvas上下文
  qr.canvasContext = canvasContext
  // 调用绘制方法将二维码图案绘制到canvas上
  qr.drawCanvas()
}

const simulatePay = () => {
  console.log('simulatePay')
  if (oid.value) {
    const SimulateStore = useSimulateStore()
    SimulateStore.setSimulateId(oid.value)
    SimulateStore.setSimulateData(oid.value)
    uni.showToast({
      title: '模拟支付成功',
      icon: 'none',
      duration: 1000,
    })
  } else {
    uni.showToast({
      title: '模拟失败请说稍后再试',
      icon: 'none',
      duration: 1000,
    })
  }
}

defineExpose({
  openDialog,
})
</script>

<template>
  <view class="">
    <uni-popup ref="qrcodePopup" type="center" :is-mask-click="false" background-color="#fff">
      <view class="pay-box">
        <image
          @click="payment"
          src="/static/resource/images/modal_closer.png"
          style="display: block; width: 30rpx; height: 30rpx"
        ></image>
        <view class="text-center">微信支付</view>
        <canvas id="qrcode" canvas-id="qrcode" style="width: 300rpx; height: 300rpx"></canvas>
        <button @click="simulatePay" class="btnp">模拟支付</button>
        <view class="text-center">请用本人微信扫描以上二维码</view>
        <view class="text-center">确认支付后请关闭此窗口</view>
      </view>
    </uni-popup>
  </view>
</template>

<style scoped lang="scss">
.text-center {
  text-align: center;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
}
.pay-box {
  padding: 40rpx;
}
.pay-box canvas {
  margin: 0 auto;
}
</style>
