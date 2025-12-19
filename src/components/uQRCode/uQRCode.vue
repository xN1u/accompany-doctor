<script setup>
import { ref, nextTick } from 'vue'
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
  console.log('openDialogtest')
  // 第一步：先打开弹窗
  qrcodePopup.value.open('center')
  console.log('urlData', urlData)

  // 第二步：等待弹窗DOM渲染完成后再绘制二维码（核心修复）
  nextTick(async () => {
    try {
      if (!urlData) {
        uni.showToast({ title: '二维码内容不能为空', icon: 'none' })
        return
      }

      // 1. 初始化UQRCode实例
      const qr = new UQRCode()
      qr.data = urlData
      qr.size = 150

      // 2. 制作二维码
      qr.make()

      // 3. 获取Canvas上下文（兼容小程序/APP，增加当前页面实例）
      const canvasContext = uni.createCanvasContext(
        'qrcode',
        getCurrentPages()[getCurrentPages().length - 1],
      )
      if (!canvasContext) {
        throw new Error('获取Canvas上下文失败')
      }

      // 4. 清空Canvas（避免多次绘制叠加）
      canvasContext.clearRect(0, 0, qr.size, qr.size)
      // 设置上下文并绘制
      qr.canvasContext = canvasContext
      qr.drawCanvas()

      // 5. 调用draw()才能渲染到页面
      canvasContext.draw(false, () => {
        console.log('二维码绘制成功')
      })
    } catch (error) {
      console.error('二维码绘制失败：', error)
      uni.showToast({ title: '二维码生成失败', icon: 'none' })
    }
  })
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
      title: '模拟失败请稍后再试',
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
