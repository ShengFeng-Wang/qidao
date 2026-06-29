<script setup lang="ts">
import { Volume2, Pause, Play, Square } from 'lucide-vue-next'

defineProps<{
  supported: boolean
  isPlaying: boolean
  isPaused: boolean
  rate: number
}>()

const emit = defineEmits<{
  play: []
  pause: []
  resume: []
  stop: []
  setRate: [r: number]
}>()
</script>

<template>
  <div class="speech-bar" v-if="supported">
    <!-- 沒在播:顯示「朗讀」播放鈕 -->
    <button v-if="!isPlaying" class="sp-btn main" @click="emit('play')" aria-label="開始朗讀">
      <Volume2 :size="18" />
      <span>朗讀本章</span>
    </button>

    <!-- 播放中:暫停/續播 + 停止 + 語速 -->
    <template v-else>
      <button v-if="!isPaused" class="sp-btn" @click="emit('pause')" aria-label="暫停">
        <Pause :size="18" />
      </button>
      <button v-else class="sp-btn" @click="emit('resume')" aria-label="續播">
        <Play :size="18" />
      </button>

      <button class="sp-btn" @click="emit('stop')" aria-label="停止">
        <Square :size="16" />
      </button>

      <div class="sp-rate">
        <span class="rate-label">語速</span>
        <input
          type="range" min="0.5" max="2" step="0.1" :value="rate"
          @input="emit('setRate', Number(($event.target as HTMLInputElement).value))"
        />
        <span class="rate-val">{{ rate.toFixed(1) }}×</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.speech-bar {
  position: absolute;
  right: 20px; bottom: 88px;   /* 在底部 toolbar 之上,不打架 */
  z-index: 26;
  display: flex; align-items: center; gap: 10px;
  padding: 8px 14px;
  background: rgba(20, 14, 8, 0.82);
  border: 1px solid rgba(184,138,59,0.45);
  border-radius: 30px;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
}
[data-theme='light'] .speech-bar {
  background: rgba(245, 235, 215, 0.92);
  border-color: rgba(154,111,42,0.5);
}

.sp-btn {
  display: flex; align-items: center; gap: 6px;
  background: transparent; border: none; cursor: pointer;
  color: #e8c987; font-family: var(--font-body); font-size: 14px;
  padding: 4px 8px; border-radius: 16px; transition: color 0.2s;
}
[data-theme='light'] .sp-btn { color: #6b4a1f; }
.sp-btn:hover { color: #f0d89a; }
[data-theme='light'] .sp-btn:hover { color: #8c2f1b; }
.sp-btn.main { color: #f0d89a; }

.sp-rate { display: flex; align-items: center; gap: 8px; }
.rate-label { font-size: 12px; color: #c8a96a; }
[data-theme='light'] .rate-label { color: #8a5a2b; }
.sp-rate input[type='range'] { width: 80px; accent-color: var(--gold); cursor: pointer; }
.rate-val { font-size: 12px; color: #e8d4a8; min-width: 30px; }
[data-theme='light'] .rate-val { color: #6b4a1f; }

@media (max-width: 768px) {
  .speech-bar { right: 12px; bottom: 76px; gap: 8px; padding: 7px 12px; }
  .sp-rate input[type='range'] { width: 60px; }
  .sp-btn.main span { font-size: 13px; }
}
</style>
