<template>
  {{ formater }}
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    second: number
    format: string
    sformat: string
    suffix: string
  }>(),
  {
    second: 0,
    format: 'MM-dd hh:mm',
    sformat: 'hh:mm:ss',
    suffix: '',
  },
)
const emit = defineEmits(['counterOver'])
// 倒计时显示
const formater = ref('')

onMounted(() => {
  formater.value = TIME_FORMAT(props.second)
})
// 倒计时逻辑处理
const TIME_FORMAT = (ts: number): string => {
  let res
  const showtime = () => {
    if (ts <= 0) {
      clearInterval(run)
      emit('counterOver')
      return TIME_SFORMAT(0, props.sformat, props.suffix)
    }
    res = TIME_SFORMAT(ts, props.sformat, props.suffix)
    return res
  }
  const run = setInterval(() => {
    ts -= 1000
    res = showtime()
    formater.value = res
  }, 1000)
  return ''
}
const TIME_FORMIN = (param: number): string => {
  let paramStr = param.toString()
  if (param < 0) {
    paramStr = '0'
  }
  if (param < 10) {
    paramStr = '0' + paramStr
  }
  return paramStr
}

const TIME_SFORMAT = (ts: number, sfmt: string, suffix: string): string => {
  const time = {
    'h+': TIME_FORMIN(Math.floor((ts / 1000 / 60 / 60) % 24)),
    'm+': TIME_FORMIN(Math.floor((ts / 1000 / 60) % 60)),
    's+': TIME_FORMIN(Math.floor((ts / 1000) % 60)),
  } as any
  for (const k in time) {
    if (Object.prototype.hasOwnProperty.call(time, k)) {
      const reg = new RegExp(`(${k})`)
      const match = reg.exec(sfmt)
      if (match) {
        const [matchedStr] = match
        const value = time[k as keyof typeof time]
        sfmt = sfmt.replace(
          matchedStr,
          matchedStr.length === 1 ? value : `00${value}`.slice(value.length),
        )
      }
    }
  }

  return sfmt + suffix
}
</script>

<style></style>
