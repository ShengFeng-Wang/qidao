<script setup lang="ts">
import { Search, Bookmark, History, Settings } from 'lucide-vue-next'

defineProps<{
  title: string
}>()
</script>

<template>
  <header class="topbar">
    <div class="topbar-left">
      <img class="compass" src="@/assets/images/compass.png" alt="" />
      <span class="site-title">{{ title }}</span>
    </div>

    <div class="topbar-search">
      <Search :size="18" class="search-icon" />
      <input type="text" placeholder="搜尋章節、標題、角色…" />
    </div>

    <nav class="topbar-actions">
      <button class="topbar-btn"><Bookmark :size="18" /><span>書籤</span></button>
      <button class="topbar-btn"><History :size="18" /><span>歷史</span></button>
      <button class="topbar-btn"><Settings :size="18" /><span>設定</span></button>
      <button class="avatar" aria-label="會員"></button>
    </nav>
  </header>
</template>

<style scoped>
.topbar {
  flex: 0 0 auto;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 0 24px;
  background: linear-gradient(180deg, #1a1410, #120d09);
  border-bottom: 1px solid var(--gold);
  z-index: 50;
}
.topbar-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
.compass { height: 36px; width: 36px; object-fit: contain; filter: drop-shadow(0 0 6px rgba(184,138,59,0.4)); }
.site-title { font-family: var(--font-title); font-size: 20px; font-weight: 700; color: #e8c987; white-space: nowrap; }
.topbar-search {
  flex: 1; max-width: 440px; margin: 0 auto; display: flex; align-items: center; gap: 8px;
  padding: 8px 16px; background: rgba(0,0,0,0.35); border: 1px solid rgba(184,138,59,0.4); border-radius: 24px;
}
.search-icon { color: rgba(232,201,135,0.7); flex: 0 0 auto; }
.topbar-search input { flex: 1; background: transparent; border: none; outline: none; color: #e8d4a8; font-family: var(--font-body); font-size: 14px; }
.topbar-search input::placeholder { color: rgba(232,201,135,0.45); }
.topbar-actions { display: flex; align-items: center; gap: 18px; }
.topbar-btn { display: flex; align-items: center; gap: 6px; background: transparent; border: none; color: #c8a96a; font-family: var(--font-body); font-size: 14px; cursor: pointer; transition: color 0.2s; }
.topbar-btn:hover { color: #f0d89a; }
.avatar { width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--gold); background: radial-gradient(circle at 50% 35%, #3a2a18, #1a1208); cursor: pointer; }

@media (max-width: 1024px) {
  .topbar-search { display: none; }
}
@media (max-width: 768px) {
  .topbar-btn span { display: none; }
  .topbar-actions { gap: 14px; }
  .site-title { font-size: 16px; }
}
</style>
