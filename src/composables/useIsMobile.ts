import { ref, onMounted, onUnmounted } from 'vue'

// 監聽視窗寬度,判斷是否為手機(≤ breakpoint)。
// 預設 768,與 CSS 的手機斷點一致。
export function useIsMobile(breakpoint = 768) {
  const isMobile = ref(false)

  function update() {
    isMobile.value = window.innerWidth <= breakpoint
  }

  onMounted(() => {
    update()
    window.addEventListener('resize', update)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', update)
  })

  return { isMobile }
}