<script setup lang="ts">
</script>

<template>
  <section class="cards-section">

     <!-- 跨在交界處的捲軸 bar -->
    <div class="divider-bar"></div>

    <div class="cards-container">
      <!-- 第一欄:最新章節 -->
      <div class="card">
        <h2 class="card-title">最新章節</h2>
        <p class="card-en">LATEST CHAPTER</p>
        <div class="card-body">
          <p>（最新章節內容之後放這裡）</p>
        </div>
      </div>

      <!-- 第二欄:書庫分類 -->
      <div class="card">
        <h2 class="card-title">書庫分類</h2>
        <p class="card-en">LIBRARY CATEGORIES</p>
        <div class="card-body">
          <p>（書庫分類內容之後放這裡）</p>
        </div>
      </div>

      <!-- 第三欄:無旗酒館 -->
      <div class="card">
        <h2 class="card-title">無旗酒館</h2>
        <p class="card-en">CROW'S TAVERN</p>
        <div class="card-body">
          <p>（論壇討論內容之後放這裡）</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cards-section {
  padding: 80px 50px;
  background-color: transparent;
  position: relative;
}

.divider-bar {
  width: 100%;
  max-width: 1600px;
  height: 90px;
  margin: 0 auto;
  margin-top: -50px;
  margin-bottom: 40px;
  background-image: url('@/assets/images/scroll-bar.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  z-index: 5;
}

.cards-container {
  max-width: 1600px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 4fr 3fr 2fr;
  gap: 10px;
}

.card {
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 520px;
  padding: 0;
}

.card:nth-child(1),
.card:nth-child(3) {
  background-image: url('@/assets/images/card-bg.png');
}

.card:nth-child(2) {
  background-image: url('@/assets/images/card-bg1.png');
}

.card-title {
  font-family: var(--font-title);
  font-size: 26px;
  font-weight: 900;
  color: #f5e6c8;
  text-align: center;
  padding-top: 10px;
  margin-bottom: -2px;
}

.card-en {
  font-size: 12px;
  letter-spacing: 3px;
  color: #e0c89a;
  opacity: 1;
  text-align: center;
  margin-bottom: 0;
}

/* 第二欄(全牛皮紙底):改成深色才看得清 */
.card:nth-child(2) .card-title {
  color: #6b2418;
}

.card:nth-child(2) .card-en {
  color: #8a5a2b;
}

.card-body {
  color: var(--text-main);
  padding: 30px 36px 50px;
}

@media (max-width: 1024px) {
  .cards-container {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .cards-section {
    padding: 50px 24px;
  }

  .cards-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .card {
    min-height: auto;
    padding-bottom: 30px;
  }
}
</style>