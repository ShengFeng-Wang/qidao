import { ref, computed, onUnmounted } from 'vue'
import type { Segment } from '@/types/novel'

// 瀏覽器內建語音朗讀(免費版)。
// 已修正:
// - 語速改變不再「cancel 重念當前段」(那會被滑桿連續觸發 + cancel 連鎖,導致每句重念多次)。
//   改為:新語速只影響「下一段」,當前句念完自然套用。
// - 加 onend 防重觸發鎖,擋掉 Chrome 偶發的重複 onend。

export interface SpeakOptions {
  voiceForSpeaker?: (speaker: string | null) => { voiceURI?: string; pitch?: number }
}

export function useSpeech() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  const voices = ref<SpeechSynthesisVoice[]>([])
  const isPlaying = ref(false)
  const isPaused = ref(false)
  const currentIndex = ref(-1)
  const rate = ref(1)

  let segments: Segment[] = []
  let opts: SpeakOptions = {}
  let stopped = false
  // 每次念一段都配一個唯一 token;onend 只認得最新 token,
  // 擋掉 cancel/Chrome 造成的重複 onend 連鎖。
  let speakToken = 0

  function loadVoices() {
    if (!supported) return
    const list = window.speechSynthesis.getVoices()
    if (list.length) voices.value = list
  }
  if (supported) {
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }

  const chineseVoices = computed(() =>
    voices.value.filter((v) => /zh|cmn|Chinese|中文/i.test(v.lang + ' ' + v.name)),
  )

  function speakSegment(i: number) {
    if (stopped || i >= segments.length) {
      finish()
      return
    }
    const seg = segments[i]
    currentIndex.value = i

    if (!seg.text.trim()) {
      speakSegment(i + 1)
      return
    }

    // 這次發聲的專屬 token
    const myToken = ++speakToken
    let ended = false // 本段是否已處理過結束(防重)

    const u = new SpeechSynthesisUtterance(seg.text)
    u.rate = rate.value      // 套用「當下」語速;下一段會自動拿到最新值
    u.lang = 'zh-TW'

    const conf = opts.voiceForSpeaker?.(seg.speaker)
    if (conf?.voiceURI) {
      const v = voices.value.find((x) => x.voiceURI === conf.voiceURI)
      if (v) u.voice = v
    }
    if (conf?.pitch != null) u.pitch = conf.pitch

    const goNext = () => {
      if (ended) return            // 本段已經處理過 → 忽略重複觸發
      if (myToken !== speakToken) return // 不是最新一次發聲 → 忽略(被 cancel 過)
      if (stopped) return
      ended = true
      speakSegment(i + 1)
    }

    u.onend = goNext
    u.onerror = goNext

    window.speechSynthesis.speak(u)
  }

  function finish() {
    isPlaying.value = false
    isPaused.value = false
    currentIndex.value = -1
  }

  function play(segs: Segment[], options: SpeakOptions = {}, startAt = 0) {
    if (!supported) return
    stop()
    segments = segs
    opts = options
    stopped = false
    isPlaying.value = true
    isPaused.value = false
    speakSegment(startAt)
  }

  function pause() {
    if (!supported || !isPlaying.value) return
    window.speechSynthesis.pause()
    isPaused.value = true
  }

  function resume() {
    if (!supported || !isPaused.value) return
    window.speechSynthesis.resume()
    isPaused.value = false
  }

  function stop() {
    if (!supported) return
    stopped = true
    speakToken++ // 讓任何尚未觸發的 onend 全部失效
    window.speechSynthesis.cancel()
    finish()
  }

  // 語速:只更新數值,不打斷當前句。新語速會在「下一段」自然生效。
  function setRate(r: number) {
    rate.value = Math.min(2, Math.max(0.5, r))
  }

  onUnmounted(stop)

  return {
    supported,
    voices,
    chineseVoices,
    isPlaying,
    isPaused,
    currentIndex,
    rate,
    play,
    pause,
    resume,
    stop,
    setRate,
  }
}
