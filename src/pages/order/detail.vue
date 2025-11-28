<script setup lang="ts">
import { formatime } from '@/composables/formatime'
import { getOrderDetailApi } from '@/services/order'
import { useSimulateStore } from '@/stores'
import type { OrderDetailData } from '@/types/order'
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'

const oid = ref('')
const orderDetail = ref<OrderDetailData>()
const uQRCodeRef = ref<any>()
const simulateStore = useSimulateStore()

const currentStep = computed(() => {
  return statusMap[orderDetail.value?.trade_state || '已取消']
})

const statusMap: Record<string, number> = {
  已取消: 0,
  待支付: 2,
  待服务: 3,
  已完成: 4,
}

const counterOver = () => {
  uni.showToast({
    title: '订单已超时，请重新下单',
    icon: 'none',
    duration: 2000,
  })
  uni.navigateBack()
}

const toPay = () => {
  console.log(oid.value)
  uQRCodeRef.value.openDialog(orderDetail.value?.code_url, oid.value)
}

const completeOrder = () => {
  simulateStore.completeSimulateData(oid.value)
  uni.navigateBack()
}

const makePhoneCall = () => {
  const tel = orderDetail.value?._staff.mobile
  if (tel) {
    try {
      uni.makePhoneCall({
        phoneNumber: tel,
      })
    } catch (e) {
      console.log('makePhoneCall error')
    }
  }
}

onLoad(async (option: any) => {
  oid.value = option.out_trade_no
  const res = await getOrderDetailApi(oid.value)
  orderDetail.value = res.data
  if (simulateStore.isSimulate(oid.value)) {
    orderDetail.value = simulateStore.findSimulateData(oid.value) || orderDetail.value
  }
  console.log(res)
})
</script>

<template>
  <view class="order-detail-page">
    <view class="step">
      <step :currentStep="currentStep"></step>
    </view>
    <uni-card v-if="currentStep === 2">
      <view class="payment">
        <view class="title">订单待支付</view>
        <view class="counter">
          请在&nbsp;<counter :second="orderDetail?._exp_time" @counterOver="counterOver"></counter
          >&nbsp;内完成支付，超时订单自动取消
        </view>
        <view class="btn">
          <button @click="toPay" class="btnp" style="border-radius: 44rpx">立即支付</button>
        </view>
        <uQRCode ref="uQRCodeRef"></uQRCode>
      </view>
    </uni-card>
    <uni-card v-else-if="currentStep === 3">
      <view class="servicing">
        <view v-if="orderDetail?.service_state === '0'">
          <view style="font-size: 28rpx; font-weight: bold">正在为您安排服务专员...</view>
          <view>请保持手机畅通，稍后将有服务专员与您联系</view>
        </view>
        <view v-else-if="orderDetail?.service_state === '1'">
          <view style="font-size: 28rpx; font-weight: bold">服务进行中</view>
          <view>已安排服务专员，将于预约时间进行服务</view>
        </view>
        <view>
          <button @click="completeOrder" class="btnp" style="border-radius: 44rpx">模拟完成</button>
        </view>
      </view>
    </uni-card>
    <uni-card v-else-if="currentStep === 4">
      <view class="servicing">
        <view>
          <view style="font-size: 28rpx; font-weight: bold">服务已完成</view>
          <view>感谢您的使用，如有售后问题请联系客服</view>
        </view>
      </view>
    </uni-card>
    <uni-card v-else-if="currentStep === 0">
      <view class="servicing">
        <view>
          <view style="font-size: 28rpx; font-weight: bold">服务已取消</view>
          <view>期待下次为您服务，如需帮助可咨询客服</view>
        </view>
      </view>
    </uni-card>

    <uni-card v-if="orderDetail?._staff.id">
      <uni-section title="本次服务专员">
        <template v-slot:decoration>
          <view class="decoration"></view>
        </template>
      </uni-section>
      <view class="staff-info">
        <view class="left">
          <block>
            <image :src="orderDetail?._staff.avatar_url" style="height: 100rpx; width: 100rpx" />
          </block>
          <block style="margin-left: 10rpx">
            <text>{{ orderDetail?._staff.nickname }}</text>
          </block>
        </view>
        <view class="right">
          <view class="btn">
            <button class="btnp" style="font-size: 26rpx" @click="makePhoneCall">电话联系</button>
          </view>
        </view>
      </view>
    </uni-card>
    <uni-card v-if="orderDetail?.service_stype === '15'">
      <uni-section title="预约信息">
        <template v-slot:decoration>
          <view class="decoration"></view>
        </template>
      </uni-section>
      <view class="info">
        <view class="info-item">
          <text>预约服务</text>
          <text>{{ orderDetail?.service_name }}</text>
        </view>
        <view class="info-item">
          <text>就诊医院</text>
          <text>{{ orderDetail?.hospital_name }}</text>
        </view>
        <view class="info-item">
          <text>就诊时间</text>
          <text>{{ formatime(orderDetail?.starttime || 0) }}</text>
        </view>
        <view class="info-item">
          <text>就诊人</text>
          <text>{{ orderDetail?.client_name }}</text>
        </view>
        <view class="info-item">
          <text>就诊人电话</text>
          <text>{{ orderDetail?.tel }}</text>
        </view>
        <view class="info-item">
          <text>接送地址</text>
          <text>{{ orderDetail?.receiveAddress }}</text>
        </view>
        <view class="info-item">
          <text>其他需求</text>
          <text>{{ orderDetail?.demand }}</text>
        </view>
      </view>
    </uni-card>
    <uni-card v-else-if="orderDetail?.service_stype === '40'">
      <uni-section title="预约信息">
        <template v-slot:decoration>
          <view class="decoration"></view>
        </template>
      </uni-section>
      <view class="info">
        <view class="info-item">
          <text>预约服务</text>
          <text>{{ orderDetail?.service_name }}</text>
        </view>
        <view class="info-item">
          <text>所在医院</text>
          <text>{{ orderDetail?.hospital_name }}</text>
        </view>
        <view class="info-item">
          <text>预约时间</text>
          <text>{{ formatime(orderDetail?.starttime || 0) }}</text>
        </view>
        <view class="info-item">
          <text>收件人</text>
          <text>{{ orderDetail?.address.userName }}</text>
        </view>
        <view class="info-item">
          <text>收件地址</text>
          <text
            >{{ orderDetail?.address.cityName }}&nbsp;{{ orderDetail?.address.countyName }}&nbsp;
            {{ orderDetail?.address.detailInfo }}</text
          >
        </view>
        <view class="info-item">
          <text>其他需求</text>
          <text>{{ orderDetail?.demand }}</text>
        </view>
      </view>
    </uni-card>
    <uni-card v-else-if="orderDetail?.service_stype === '100'">
      <uni-section title="预约信息">
        <template v-slot:decoration>
          <view class="decoration"></view>
        </template>
      </uni-section>
      <view class="info">
        <view class="info-item">
          <text>期待服务时间</text>
          <text>{{
            orderDetail.starttime ? formatime(orderDetail?.starttime || 0) : '未指定'
          }}</text>
        </view>
        <view class="info-item">
          <text>服务对象</text>
          <text>{{ orderDetail?.client_name }}</text>
        </view>
        <view class="info-item">
          <text>客户联系方式</text>
          <text>{{ orderDetail?.client_mobile }}</text>
        </view>
        <view class="info-item">
          <text>服务地址</text>
          <text>{{ orderDetail?.address.address }}</text>
        </view>
        <view class="info-item">
          <text>其他需求</text>
          <text>{{ orderDetail?.demand }}</text>
        </view>
      </view>
    </uni-card>
    <uni-card>
      <uni-section title="订单信息">
        <template v-slot:decoration>
          <view class="decoration"></view>
        </template>
      </uni-section>
      <view class="info">
        <view class="info-item">
          <text>联系电话</text>
          <text>{{ orderDetail?.tel }}</text>
        </view>
        <view class="info-item">
          <text>下单时间</text>
          <text>{{ formatime(orderDetail?.order_start_time || 0) }}</text>
        </view>
        <view class="info-item">
          <text>应付金额</text>
          <text>{{ orderDetail?.price }}￥</text>
        </view>
        <view class="info-item">
          <text>实付金额</text>
          <text>{{ orderDetail?.paidPrice }}￥</text>
        </view>
        <view class="info-item">
          <text>付款时间</text>
          <text>{{ orderDetail?.pay_time ? formatime(orderDetail?.pay_time) : '未支付' }}</text>
        </view>
        <view class="info-item">
          <text>订单编号</text>
          <text>{{ orderDetail?.out_trade_no }}</text>
        </view>
      </view>
    </uni-card>
    <view style="height: 100rpx"></view>
  </view>
</template>

<style scoped lang="scss">
.order-detail-page {
  .payment {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .title {
      font-size: 28rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }

    .btn {
      margin-top: 20px;
    }
  }
  .staff-info {
    display: flex;
    align-items: center;
    margin-top: 10rpx;

    .right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
    }
  }
  .info {
    .info-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10rpx;

      text {
        font-size: 16px;
        color: #333;
      }
    }
  }
}
.decoration {
  width: 6px;
  height: 20px;
  margin-right: 4px;
  background-color: #27ba9b;
}
</style>
