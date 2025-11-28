<script setup lang="ts">
import { createOrderApi, getOrderListApi } from '@/services/order'
import { getServiceListApi } from '@/services/service'
import { useUserStore } from '@/stores'
import type { OrderBodyData } from '@/types/order'
import type { Service, ServiceClient, ServiceHospital } from '@/types/service'
import { onLoad } from '@dcloudio/uni-app'
import type { UniFormsRules } from '@uni-helper/uni-ui-types'
import { onUnmounted, ref } from 'vue'

const currentStep = ref(1)
const svid = ref<number>()
const hid = ref<number>()
const serviceContent = ref<Service>()
const hospitalList = ref<ServiceHospital[]>([])
const order = ref<OrderBodyData>({
  starttime: undefined,
  client: {
    name: '',
    mobile: '',
    age: 0,
    sex: 0,
  },
  address: {
    cityName: '广州市',
    countyName: '天河区',
    detailInfo: '',
    userName: '张三',
  },
  receiveAddress: '',
  tel: '',
  hospital_id: 0,
  hospital_name: '',
  demand: '',
  service_code: '',
  service_id: 0,
  service_name: '',
  service_stype: '',
})
const servicePrice = ref<string>('')
const hospitalindex = ref<number>(-1)
const cfg = ref<any>({
  page_xy: '',
  page_fw: '',
})
const isAgree = ref(false)
const oid = ref<string>('')

const dialogRef = ref<any>()
const uQRCodeRef = ref<any>()
const formRef1 = ref<any>()
const formRef2 = ref<any>()
const rules: UniFormsRules = {
  starttime: { rules: [{ required: true, errorMessage: '请选择服务时间' }] },
  client: {
    rules: [
      {
        validateFunction: function (
          rule: any,
          value: any,
          data: any,
          callback: (errorMsg?: string) => void,
        ) {
          if (!value || !value.name || value.name.trim() === '') {
            callback('请选择就诊人')
          } else {
            callback()
          }
        },
      },
    ],
  },
  receiveAddress: {
    rules: [{ required: true, errorMessage: '请填写就诊人所在地址' }],
  },
  tel: {
    rules: [
      { required: true, errorMessage: '请填写您的联系电话' },
      { pattern: '^1[3-9]\\d{9}$', errorMessage: '请输入正确的手机号' },
    ],
  },
  hospital_name: {
    rules: [
      {
        required: true,
        errorMessage: '请选择就诊所在医院',
        validateFunction: function (
          rule: any,
          value: any,
          data: any,
          callback: (errorMsg?: string) => void,
        ) {
          if (!value || value.trim() === '') {
            callback('请选择就诊所在医院')
          } else {
            callback()
          }
        },
      },
    ],
  },
}
const rules2: UniFormsRules = {
  starttime: { rules: [{ required: true, errorMessage: '请选择服务时间' }] },
  address: {
    rules: [
      {
        validateFunction: function (
          rule: any,
          value: any,
          data: any,
          callback: (errorMsg?: string) => void,
        ) {
          if (!value || !value.userName || value.userName.trim() === '') {
            callback('请选择收件地址')
          } else {
            callback()
          }
        },
      },
    ],
  },
  tel: {
    rules: [
      { required: true, errorMessage: '请填写您的联系电话' },
      { pattern: '^1[3-9]\\d{9}$', errorMessage: '请输入正确的手机号' },
    ],
  },
  hospital_name: {
    rules: [
      {
        required: true,
        errorMessage: '请选择就诊所在医院',
        validateFunction: function (
          rule: any,
          value: any,
          data: any,
          callback: (errorMsg?: string) => void,
        ) {
          if (!value || value.trim() === '') {
            callback('请选择就诊所在医院')
          } else {
            callback()
          }
        },
      },
    ],
  },
}

const initServicePage = async () => {
  const res = await getServiceListApi(svid.value as number)
  serviceContent.value = res.data.service
  hospitalList.value = res.data.hospitals
  if (hid.value) {
    const hospital = hospitalList.value.find((item) => item.id === hid.value)
    if (hospital) {
      hospitalindex.value = hospitalList.value.indexOf(hospital)
      order.value.hospital_id = hospital.id
      order.value.hospital_name = hospital.name
    }
  }
  servicePrice.value = res.data.service.price
  order.value.service_code = res.data.service.code
  order.value.service_id = res.data.service.id
  order.value.service_name = res.data.service.name
  order.value.service_stype = res.data.service.stype
  console.log(order.value.service_stype)
}

const hospitalChange = (e: any) => {
  hospitalindex.value = e.detail.value
  const hospital = hospitalList.value[hospitalindex.value]
  if (hospital) {
    order.value.hospital_id = hospital.id
    order.value.hospital_name = hospital.name
  } else {
    order.value.hospital_id = 0
    order.value.hospital_name = ''
  }
}

const timeChange = (e: any) => {
  order.value.starttime = e.detail.value
}

const goSelectClient = () => {
  uni.navigateTo({
    url: `/pages/client/index?isSelect=${true}&selectId=${order.value.client?.id}`,
  })
}

const goGetAddress = () => {
  uni.showToast({
    title: '该功能正在完善',
    icon: 'none',
    duration: 1000,
  })
}

const clientSelectChange = (client: Partial<ServiceClient>) => {
  order.value.client = client
}

const handleAgreeChange = (e: any) => {
  e.detail.value[0] ? (isAgree.value = true) : (isAgree.value = false)
}

const createOrder = async (order: OrderBodyData) => {
  const userStore = useUserStore()
  if (userStore.token) {
    const res = await createOrderApi(order)
    const result = await getOrderListApi('1')
    oid.value = result.data[0].out_trade_no
    uQRCodeRef.value.openDialog(res.wx_code, oid.value)
  } else {
    dialogRef.value.open()
  }
}

const dialogConfirm = () => {
  uni.navigateTo({
    url: '/pages/login/index',
  })
  dialogRef.value.close()
}

const submit = () => {
  if (order.value.service_stype === '15') {
    formRef1.value
      .validate()
      .then(() => {
        createOrder(order.value)
      })
      .catch((err: any) => {
        console.log('form1 validate fail')
        console.log(err)
      })
  } else if (order.value.service_stype === '40') {
    formRef2.value
      .validate()
      .then(() => {
        createOrder(order.value)
      })
      .catch((err: any) => {
        console.log('form2 validate fail')
        console.log(err)
      })
  }
}

uni.$on('clientSelectChange', clientSelectChange)

onLoad((option) => {
  svid.value = parseInt(option?.svid) || 0
  hid.value = parseInt(option?.hid) || 0
  initServicePage()
})

onUnmounted(() => {
  uni.$off('clientSelectChange', clientSelectChange)
})
</script>

<template>
  <view class="service-page">
    <view class="step">
      <step :currentStep="currentStep"></step>
    </view>
    <uni-card>
      <view class="service-container">
        <image :src="serviceContent?.icon_image_url" style="width: 64rpx; height: 64rpx" />
        <text style="margin-left: 10rpx; font-weight: bold">{{ serviceContent?.name }}</text>
        <view class="right">
          <image src="@/static/resource/images/ic_qaa.png" style="width: 32rpx; height: 32rpx" />
          <text style="font-weight: lighter; margin-left: 10rpx">服务内容</text>
        </view>
      </view>
    </uni-card>
    <uni-card class="service-form" v-if="order.service_stype === '15'">
      <uni-forms ref="formRef1" :model="order" :rules="rules">
        <uni-forms-item label="就诊医院" :label-width="120" name="hospital_name">
          <view class="select">
            <picker
              @change="hospitalChange"
              :value="hospitalindex"
              :range="hospitalList"
              range-key="name"
            >
              <view class="right">
                <input
                  type="text"
                  :disabled="true"
                  placeholder="请选择就诊所在医院"
                  :value="order.hospital_name"
                  placeholder-class="vp-placeholder"
                  style="text-align: right"
                />
                <image
                  src="@/static/resource/images/ic_arrow.png"
                  style="height: 32rpx; width: 32rpx; margin-left: 10rpx"
                />
              </view>
            </picker>
          </view>
        </uni-forms-item>
        <uni-forms-item label="就诊时间" :label-width="120" name="starttime">
          <view class="select">
            <dtPicker
              @dtPickerChanged="timeChange"
              :timestamp="order.starttime"
              :placeholder="'请选择服务时间'"
            ></dtPicker>
          </view>
        </uni-forms-item>
        <uni-forms-item label="就诊人" :label-width="120" name="client">
          <view class="select" @tap="goSelectClient">
            <view class="right">
              <input
                type="text"
                :disabled="true"
                placeholder="请选择就诊人"
                :value="order.client?.name"
                placeholder-class="vp-placeholder"
                style="text-align: right"
              />
              <image
                src="@/static/resource/images/ic_arrow.png"
                style="height: 32rpx; width: 32rpx; margin-left: 10rpx"
              />
            </view>
          </view>
        </uni-forms-item>
        <uni-forms-item label="接送地址" :label-width="120" name="receiveAddress">
          <view class="select">
            <view class="right">
              <input
                type="text"
                placeholder="请填写就诊人所在地址"
                :value="order.receiveAddress"
                @input="(e: any) => {
                  order.receiveAddress = e.target.value
                }"
                placeholder-class="vp-placeholder"
                style="text-align: right"
              />
            </view>
          </view>
        </uni-forms-item>
        <uni-forms-item label="联系电话" :label-width="120" name="tel">
          <view class="select">
            <view class="right">
              <input
                type="text"
                placeholder="请填写您的联系电话"
                :value="order.tel"
                @input="(e: any) => {
                  order.tel = e.target.value
                }"
                placeholder-class="vp-placeholder"
                style="text-align: right"
              />
            </view>
          </view>
        </uni-forms-item>
      </uni-forms>
    </uni-card>
    <uni-card class="service-form" v-else-if="order.service_stype === '40'">
      <uni-forms ref="formRef2" :model="order" :rules="rules2">
        <uni-forms-item label="所在医院" :label-width="120" name="hospital_name">
          <view class="select">
            <picker
              @change="hospitalChange"
              :value="hospitalindex"
              :range="hospitalList"
              range-key="name"
            >
              <view class="right">
                <input
                  type="text"
                  :disabled="true"
                  placeholder="请选择就诊所在医院"
                  :value="order.hospital_name"
                  placeholder-class="vp-placeholder"
                  style="text-align: right"
                />
                <image
                  src="@/static/resource/images/ic_arrow.png"
                  style="height: 32rpx; width: 32rpx; margin-left: 10rpx"
                />
              </view>
            </picker>
          </view>
        </uni-forms-item>
        <uni-forms-item label="服务时间" :label-width="120" name="starttime">
          <view class="select">
            <dtPicker
              @dtPickerChanged="timeChange"
              :timestamp="order.starttime"
              :placeholder="'请选择服务时间'"
            ></dtPicker>
          </view>
        </uni-forms-item>
        <uni-forms-item label="收件信息" :label-width="120" name="address">
          <view class="select" @tap="goGetAddress">
            <view class="right">
              <input
                type="text"
                :disabled="true"
                placeholder="请选择收件信息"
                :value="
                  order.address
                    ? `${order.address.cityName || ''}-${order.address.countyName || ''}`.replace(
                        /^-|-$/g,
                        '',
                      )
                    : ''
                "
                placeholder-class="vp-placeholder"
                style="text-align: right"
              />
              <image
                src="@/static/resource/images/ic_arrow.png"
                style="height: 32rpx; width: 32rpx; margin-left: 10rpx"
              />
            </view>
          </view>
        </uni-forms-item>
        <uni-forms-item label="联系电话" :label-width="120" name="tel">
          <view class="select">
            <view class="right">
              <input
                type="text"
                placeholder="请填写您的联系电话"
                :value="order.tel"
                @input="(e: any) => {
                  order.tel = e.target.value
                }"
                placeholder-class="vp-placeholder"
                style="text-align: right"
              />
            </view>
          </view>
        </uni-forms-item>
      </uni-forms>
    </uni-card>
    <uni-card title="服务需求">
      <uni-forms>
        <uni-forms-item>
          <view class="demand-container">
            <textarea
              placeholder="请填写您的服务要求"
              :value="order.demand"
              @input="(e:any) => {
                order.demand = e.target.value
              }"
              placeholder-class="vp-placeholder"
              style="height: 150rpx"
            ></textarea>
          </view>
        </uni-forms-item>
      </uni-forms>
    </uni-card>
    <view style="height: 300rpx"> </view>
    <view class="foot-container">
      <view style="padding: 20rpx">
        <!-- 协议勾选区域 -->
        <view class="deal">
          <checkbox-group @change="handleAgreeChange">
            <checkbox
              value="isAgree"
              :checked="isAgree"
              style="transform: scale(0.8); margin-right: 10rpx"
            />
          </checkbox-group>
          <text>我已阅读并同意</text>
          <navigator class="protocol-link">《用户协议》</navigator>
          <text>和</text>
          <navigator class="protocol-link">《服务协议》</navigator>
        </view>
        <!-- 下单按钮 -->
        <view class="btn-container">
          <button
            @click="submit"
            :disabled="!isAgree"
            :class="'btnp' + (isAgree ? '' : 'btnp-disabled')"
            style="border-radius: 44rpx"
          >
            确认下单
            <block v-if="servicePrice">（支付{{ servicePrice }}元）</block>
          </button>
          <uni-popup ref="dialogRef" type="dialog">
            <uni-popup-dialog content="请先登录" @confirm="dialogConfirm"></uni-popup-dialog>
          </uni-popup>
          <uQRCode ref="uQRCodeRef"></uQRCode>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.service-page {
  .service-container {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    .right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
  .service-form {
    ::v-deep .uni-forms-item {
      .uni-forms-item__content {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }

      .select {
        .right {
          display: flex;
          align-items: center;
          color: #666;
          font-size: 28rpx;
          padding: 10rpx 0;
          width: 100%;
          justify-content: flex-end;
        }
      }
      &:not(:last-child) {
        border-bottom: #eee 1px solid;
      }
    }
  }
  .foot-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 999;
    box-sizing: border-box;
    background: #eee;
    .deal {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;
      font-size: 26rpx;

      .custom-checkbox {
        transform: scale(0.8);
        margin-right: 10rpx;

        ::v-deep .wx-checkbox-input {
          border-color: #ccc !important;
          width: 30rpx !important;
          height: 30rpx !important;
        }
        ::v-deep .wx-checkbox-input.checked {
          background-color: #27ba9b !important;
          border-color: #27ba9b !important;
        }
      }

      .protocol-link {
        color: #27ba9b !important;
        margin: 0 4rpx;
        text-decoration: underline;
      }
    }
  }
}
</style>
