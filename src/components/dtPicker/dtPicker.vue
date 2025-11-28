<template>
  <view>
    <picker
      mode="multiSelector"
      @change="doChange"
      @columnchange="doColumnChange"
      :value="self_value"
      :range="self_range"
    >
      <view class="right">
        <input
          :disabled="true"
          :placeholder="placeholder"
          :value="value_text"
          class="right-input"
          style="text-align: right"
        />
        <image
          src="@/static/resource/images/ic_arrow.png"
          style="height: 32rpx; width: 32rpx; margin-left: 10rpx"
        />
      </view>
    </picker>
  </view>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, defineProps, defineEmits, toRaw, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    timestamp: number
    emptyText: string
    placeholder: string
  }>(),
  {
    timestamp: 0,
    emptyText: '',
    placeholder: '',
  },
)

const emit = defineEmits(['dtPickerChanged'])

const now = new Date().getTime()
const self_range = ref<string[][]>([])
const self_days = ref<string[]>([])
const self_days_text = ref<string[]>([])
const self_hours = ref<string[]>([])
const self_seconds = ref<string[]>([])
const self_value = ref<[number, number, number]>([0, 0, 0])
const value_text = ref<string | undefined>(undefined)

const TIME_FORMAT = (timestamp: number, fmt: string): string => {
  const date = new Date(timestamp)
  const o: Record<string, number> = {
    'Y+': date.getFullYear(),
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  }

  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] + '' : o[k] < 10 ? `0${o[k]}` : o[k] + '',
      )
    }
  }

  return fmt
}

const getValueText = (): string => {
  const [dayIdx, hourIdx, minuteIdx] = self_value.value
  const dayText = self_days_text?.value[dayIdx] || ''
  const hour = self_hours?.value[hourIdx] || ''
  const minute = self_seconds?.value[minuteIdx] || ''
  return self_days?.value[dayIdx] ? `${dayText} ${hour}:${minute}` : dayText
}

onBeforeMount(() => {
  const days: string[] = ['']
  const daysText: string[] = [props.emptyText || '']
  const hours: string[] = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
  const minutes: string[] = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

  for (let i = 0; i < 20; i++) {
    const currentTime = now + 86400000 * i
    const dateValue = TIME_FORMAT(currentTime, 'YYYY-MM-dd')
    let dateText = TIME_FORMAT(currentTime, 'M月d日')

    if (i === 0) dateText += ' （今天）'
    if (i === 1) dateText += ' （明天）'
    if (i === 2) dateText += ' （后天）'

    days.push(dateValue)
    daysText.push(dateText)
  }

  self_range.value = [daysText, hours, minutes]
  self_days.value = days
  self_days_text.value = daysText
  self_hours.value = hours
  self_seconds.value = minutes
  value_text.value = getValueText()
})

const doChange = () => {
  value_text.value = getValueText()

  const [dayIdx, hourIdx, minuteIdx] = self_value.value
  const day = self_days?.value[dayIdx]
  const hour = self_hours?.value[hourIdx]
  const minute = self_seconds?.value[minuteIdx]

  let datetime = ''
  if (day && hour && minute) {
    datetime = `${day} ${hour}:${minute}`
  }

  const timestamp = datetime ? new Date(datetime.replace(/-/g, '/')).getTime() : 0

  console.log('picker change', datetime, timestamp)

  emit('dtPickerChanged', {
    detail: { value: timestamp },
  })
}

const doColumnChange = (e: any) => {
  const { column, value } = e.detail
  const currentValue = [...self_value.value]
  currentValue[column] = value
  self_value.value = currentValue as [number, number, number]
}

const timestampChange = (timestamp: number) => {
  if (!self_days.value || !self_hours.value || !self_seconds.value) return

  const targetTimestamp = timestamp < now ? now : timestamp

  const targetDate = TIME_FORMAT(targetTimestamp, 'YYYY-MM-dd')
  const targetHour = TIME_FORMAT(targetTimestamp, 'hh')
  const targetMinute = TIME_FORMAT(targetTimestamp, 'mm')

  const currentValue = [...toRaw(self_value.value)]

  const dayIdx = self_days.value.findIndex((day) => day === targetDate)
  if (dayIdx !== -1) currentValue[0] = dayIdx

  const hourIdx = self_hours.value.findIndex((hour) => hour === targetHour)
  if (hourIdx !== -1) currentValue[1] = hourIdx

  const minuteIdx = self_seconds.value.findIndex((minute) => minute === targetMinute)
  if (minuteIdx !== -1) currentValue[2] = minuteIdx

  self_value.value = currentValue as [number, number, number]
  value_text.value = getValueText()
}

watch(
  () => props.timestamp,
  (newTimestamp = 0) => {
    timestampChange(newTimestamp)
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.right {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 28rpx;
  padding: 10rpx 0;
  width: 100%;
  justify-content: flex-end;
}
</style>
