<script setup lang="ts"></script>

<template>
  <navbar title="搜索" />
  <view class="search-page" style="margin-top: 130rpx">
    <text>我的</text>
    <view>
      <uni-calendar :insert="true" :lunar="true" :start-date="'2019-3-2'" :end-date="'2019-5-20'" />
    </view>
  </view>
</template>

<style scoped lang="scss"></style>
