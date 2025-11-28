<script setup lang="ts">
import { ref } from 'vue'
import type { UniFormsRules } from '@uni-helper/uni-ui-types'
import { useUserStore } from '@/stores'
import { onLoad } from '@dcloudio/uni-app'
import { getMobileLoginCodeApi, mobileLoginApi } from '@/services/login'

const loginForm = ref({
  phone: '',
  code: '',
})

const formRef = ref<any>(null)

const isAgree = ref(false)
const isCounting = ref(false)
const countDown = ref(60)
const userStore = useUserStore()
const isSwitch = ref(false)

const rules: UniFormsRules = {
  phone: {
    rules: [
      { required: true, errorMessage: '请输入手机号' },
      { pattern: /^1[3-9]\d{9}$/, errorMessage: '请输入正确的手机号' },
    ],
  },
  code: {
    rules: [
      { required: true, errorMessage: '请输入验证码' },
      { pattern: /^\d{4}$/, errorMessage: '验证码为4位数字' },
    ],
  },
}

const setCounDown = (cd?: number) => {
  if (cd) countDown.value = cd
  isCounting.value = true
  const timer = setInterval(() => {
    countDown.value--
    uni.setStorageSync('counDown', countDown.value)
    if (countDown.value <= 0) {
      clearInterval(timer)
      isCounting.value = false
      countDown.value = 60
    }
  }, 1000)
}

const getVerifyCode = async () => {
  const validatePhone = await formRef.value?.validateField('phone')
  if (!validatePhone) return

  try {
    await getMobileLoginCodeApi(loginForm.value.phone)
    uni.showToast({ title: '验证码发送成功', icon: 'none' })
    setCounDown()
  } catch (error) {
    uni.showToast({ title: '验证码发送失败', icon: 'none' })
  }
}

const login = async () => {
  formRef.value
    ?.validate()
    .then(async () => {
      if (!isAgree.value) {
        uni.showToast({ title: '请同意用户协议和隐私政策', icon: 'none' })
        return
      }
      try {
        const res = await mobileLoginApi(loginForm.value.phone, loginForm.value.code)
        const { token } = res.data
        userStore.setToken(token)

        uni.showToast({ title: '登录成功' })
      } catch (error: any) {
        uni.showToast({ title: error.data.msg, icon: 'none' })
      }
      setTimeout(() => {
        if (isSwitch.value === false) {
          uni.navigateBack()
        } else {
          uni.switchTab({ url: '/pages/my/index' })
        }
      }, 1500)
    })
    .catch(() => {
      console.log('表单校验失败')
    })
}

onLoad((option) => {
  if (userStore.token) {
    uni.showToast({ title: '已登录', icon: 'none' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1000)
  }
  const cd = uni.getStorageSync('counDown')
  if (cd) {
    setCounDown(cd)
  }
  isSwitch.value = option?.isSwitch
  console.log(isSwitch.value)
})
</script>

<template>
  <view class="login-page">
    <view class="login-header">
      <text class="login-title">手机登录</text>
    </view>

    <uni-forms ref="formRef" :model="loginForm" :rules="rules" class="login-form">
      <uni-forms-item label="" name="phone" class="form-item">
        <view class="input-container">
          <image src="@/static/resource/images/ic_tel.png" class="input-icon" />
          <input
            type="number"
            placeholder="请输入手机号"
            :value="loginForm.phone"
            @input="(e) => (loginForm.phone = e.detail.value)"
            class="input"
          />
        </view>
      </uni-forms-item>

      <uni-forms-item label="" name="code" class="form-item">
        <view class="input-container code-container">
          <input
            type="number"
            placeholder="请输入4位验证码"
            :value="loginForm.code"
            @input="(e) => (loginForm.code = e.detail.value)"
            class="input code-input"
          />
          <button
            @click="getVerifyCode"
            :disabled="isCounting"
            class="code-btn"
            :class="isCounting ? 'code-btn-disabled' : ''"
          >
            {{ isCounting ? `${countDown}s后重新获取` : '获取验证码' }}
          </button>
        </view>
      </uni-forms-item>
    </uni-forms>

    <view class="agreement">
      <checkbox-group @change="(e) => (e.detail.value[0] ? (isAgree = true) : (isAgree = false))">
        <checkbox value="agree" :checked="isAgree" class="agreement-checkbox" />
      </checkbox-group>
      <view class="agreement-text">
        登录即同意
        <text class="agreement-link">《用户协议》</text>
        和
        <text class="agreement-link">《隐私政策》</text>
      </view>
    </view>

    <button @click="login" class="login-btn">登录</button>
  </view>
</template>

<style scoped lang="scss">
.login-page {
  padding: 60rpx 40rpx;
  background-color: #fff;
  min-height: 100vh;
  box-sizing: border-box;

  .login-header {
    text-align: center;
    margin-bottom: 80rpx;

    .login-title {
      font-size: 48rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 16rpx;
      display: block;
    }

    .login-desc {
      font-size: 28rpx;
      color: #666;
    }
  }

  .login-form {
    background-color: #fff;
    border-radius: 20rpx;
    padding: 40rpx 30rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  }

  .form-item {
    margin-bottom: 30rpx;

    ::v-deep .uni-forms-item__error {
      display: block !important;
      color: #ff4d4f !important;
      font-size: 24rpx !important;
      margin-top: 8rpx !important;
      text-align: left !important;
    }
  }

  .input-container {
    display: flex;
    align-items: center;
    border-bottom: 1rpx solid #eee;
    padding-bottom: 12rpx;

    .input-icon {
      width: 36rpx;
      height: 36rpx;
      margin-right: 20rpx;
    }

    .input {
      flex: 1;
      font-size: 30rpx;
      color: #333;
      padding: 8rpx 0;

      &::placeholder {
        color: #ccc;
        font-size: 28rpx;
      }
    }
  }

  .code-container {
    justify-content: space-between;

    .code-input {
      flex: none;
      width: 280rpx;
    }

    .code-btn {
      width: 180rpx;
      height: 60rpx;
      line-height: 60rpx;
      font-size: 26rpx;
      color: #27ba9b;
      background-color: #f0f9f7;
      border-radius: 30rpx;
      padding: 0;
      margin: 0;
    }

    .code-btn-disabled {
      color: #999;
      background-color: #f5f5f5;
    }
  }

  .agreement {
    display: flex;
    align-items: center;
    margin: 30rpx 0;
    font-size: 24rpx;
    color: #666;

    .agreement-checkbox {
      transform: scale(0.8);
      margin-right: 12rpx;
    }

    .agreement-link {
      color: #27ba9b;
      margin: 0 4rpx;
    }
  }

  .login-btn {
    width: 100%;
    height: 90rpx;
    line-height: 90rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #fff;
    background-color: #27ba9b;
    border-radius: 45rpx;
    margin-top: 20rpx;
  }
}
</style>
