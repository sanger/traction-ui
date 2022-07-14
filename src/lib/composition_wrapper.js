// This is a dummy wrapper to ensure swrv continues to operate with vue 2.7
// which includes the composition API directly. It can probably be removed when
// swrv updates
import {
  reactive,
  watch,
  ref,
  toRefs,
  isRef,
  onMounted,
  onUnmounted,
  onServerPrefetch,
  getCurrentInstance,
} from 'vue'

export {
  reactive,
  watch,
  ref,
  toRefs,
  isRef,
  onMounted,
  onUnmounted,
  onServerPrefetch,
  getCurrentInstance,
}
