<script setup lang="ts">
import type { Volume, Chapter } from '@/types/novel'

// 章節標題 + 分隔線 + 段落。滑動模式與翻頁模式共用。
// showHeader: 翻頁模式只有第一頁顯示標題
// paragraphs: 要顯示的段落(滑動=整章;翻頁=當前頁那幾段)
defineProps<{
  volume: Volume
  chapter: Chapter
  paragraphs: string[]
  showHeader?: boolean
}>()
</script>

<template>
  <div class="chapter-body">
    <template v-if="showHeader">
      <p class="vol-label">第{{ volume.order }}卷：{{ volume.title }}</p>
      <h2 class="chap-title">{{ chapter.number }} {{ chapter.title }}</h2>
      <div class="divider">
        <span class="divider-line"></span>
        <span class="divider-mark">✦</span>
        <span class="divider-line"></span>
      </div>
    </template>
    <p v-for="(para, i) in paragraphs" :key="i" class="para">{{ para }}</p>
  </div>
</template>

<style scoped>
.vol-label {
  text-align: center;
  font-family: var(--font-title);
  font-size: 16px;
  color: var(--coffee);
  opacity: 0.75;
  margin-bottom: 12px;
}
[data-theme='dark'] .vol-label { color: #c8a96a; }

.chap-title {
  text-align: center;
  font-family: var(--font-title);
  font-size: 32px;
  font-weight: 900;
  color: var(--coffee);
  letter-spacing: 2px;
}
[data-theme='dark'] .chap-title { color: #f0d89a; }

.divider {
  display: flex;
  align-items: center;
  gap: 14px;
  max-width: 420px;
  margin: 26px auto 40px;
}
.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}
.divider-mark { color: var(--gold); font-size: 14px; }

.para {
  font-family: var(--font-body);
  line-height: 2.1;
  color: var(--coffee);
  margin-bottom: 4px;
  text-align: justify;
}
[data-theme='dark'] .para { color: #e3d3b0; }

@media (max-width: 768px) {
  .chap-title { font-size: 26px; }
}
</style>
