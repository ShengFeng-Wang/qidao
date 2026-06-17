# 棄道 QIDAO

一個自架的中文小說閱讀站。前端用 Vue 3 + Vite + TypeScript,後端用 Express 提供章節的讀取、上傳與編輯,小說內容以 Markdown 檔保存。

> 在將人鍛成器的世界裡,他仍選擇成為人。

---

## 功能

- **首頁**:標題、標語與書庫分區卡片。
- **閱讀區**:側欄章節目錄、滑動 / 翻頁兩種閱讀模式、字級調整、深淺色主題切換(含 View Transition 圓形擴散動畫)。
- **上傳章節**:`/upload` 後台表單,填寫卷號、卷名、章號、章名、內文後送出,後端自動轉成 Markdown 檔並寫入內容資料夾,回閱讀區即可看到。
- **編輯章節**:章節目錄每一章書籤左側的齒輪 icon,點擊後跳到帶入該章資料的編輯表單,修改後直接覆蓋原檔(改卷號 / 章號會自動搬檔)。

---

## 技術架構

```
frontend/
├── src/
│   ├── assets/            # 圖片、theme.css
│   ├── components/        # 共用元件(Header / Hero / Cards…)
│   │   └── reader/        # 閱讀區元件(Sidebar / Toolbar / Scroll / Flip…)
│   ├── composables/       # useReader / usePagination
│   ├── content/loen/      # ★ 小說內容(Markdown 檔,由後端寫入)
│   ├── data/loadNovel.ts  # 前端資料層:打後端 API
│   ├── stores/            # Pinia(theme / counter)
│   ├── types/novel.ts     # 型別定義
│   ├── views/             # HomeView / ReaderView / UploadView
│   └── router/            # 路由
├── server/                # ★ 後端
│   ├── index.js           # Express:讀書 / 讀單章 / 新增 / 更新
│   └── package.json       # 後端相依(Express)
├── vite.config.ts         # 含 /api → 後端的 proxy
└── package.json           # 前端相依
```

資料流:前端不再用 `import.meta.glob` 在建置時讀檔,而是**執行時打後端 API** 取章節。後端掃 `src/content/<bookId>/*.md`,解析 frontmatter 後組成書籍結構回傳。上傳 / 編輯則由後端寫入或覆寫對應的 `.md` 檔,前端重新整理即可看到最新內容,**不需重啟 dev server**。

---

## 環境需求

- Node.js `^20.19.0` 或 `>=22.12.0`
- npm

---

## 專案安裝與啟動

需要**同時啟動前端與後端**(各開一個終端機)。

### 1. 後端

```sh
cd server
npm install
npm run dev          # 跑在 http://localhost:3001,存檔後自動重啟
```

### 2. 前端(於 frontend 根目錄)

```sh
npm install
npm run dev          # 跑在 http://localhost:5173
```

前端的 `/api/...` 請求會透過 `vite.config.ts` 的 proxy 自動轉到後端 `localhost:3001`,因此瀏覽器一律開前端網址即可。

---

## 使用方式

| 路徑 | 說明 |
| --- | --- |
| `/` | 首頁 |
| `/read` | 閱讀區 |
| `/upload` | 上傳新章節 |
| `/upload?edit=<章節id>` | 編輯既有章節(通常由閱讀區的齒輪 icon 進入,毋需手動輸入) |

### 上傳章節

進入 `/upload`,填寫:

- **第幾卷**(數字,如 `2`)
- **卷名**(如 `孤行荒原`)
- **第幾章**(數字,全書連續編號,如 `26`)
- **顯示章節號**(可留空,留空時自動補成「第N章」)
- **章名**(如 `沒有屋簷的夜`)
- **內文**(空一行代表分段)

送出後會寫成 `src/content/loen/<卷號>-<章號>.md`(各補零兩位,如 `02-26.md`),檔名順序即閱讀順序。同卷同章重複上傳會被擋下(回 409)。

### 編輯章節

在閱讀區章節目錄,每一章書籤左邊有齒輪 icon,點擊後跳到編輯表單並帶入原資料。修改送出會覆蓋原檔;若更動了卷號或章號,後端會寫入新檔名並刪除舊檔。

---

## Markdown 章節格式

每章是一個 `.md` 檔,放在 `src/content/<bookId>/`。上傳功能會自動產生此格式,手動新增時也可比照:

```markdown
---
volume: 孤行荒原
volumeId: vol2
volumeOrder: 2
number: 第二十六章
title: 沒有屋簷的夜
index: 26
---

老馬的蹄聲,在荒路上響了整整七天。

第七天清晨,洛恩是在車廂角落裡醒來的。
```

frontmatter 欄位:`volume`(卷名)、`volumeId`、`volumeOrder`(卷序)、`number`(顯示章節號)、`title`(章名)、`index`(全書連續章序)。內文以空行分段。

---

## 後端 API

| 方法 | 路徑 | 說明 |
| --- | --- | --- |
| `GET` | `/api/books/:bookId` | 讀整本書(含所有卷與章) |
| `GET` | `/api/books/:bookId/chapters/:chapterId` | 讀單一章節原始資料(編輯帶入用) |
| `POST` | `/api/books/:bookId/chapters` | 新增章節(寫入 md,重複會擋) |
| `PUT` | `/api/books/:bookId/chapters/:chapterId` | 更新章節(覆寫;改卷 / 章號會搬檔) |

要新增另一本書,在 `server/index.js` 的 `BOOK_META` 加一筆,並在 `src/content/` 建對應資料夾即可。

---

## 開發指令

### 開發模式(熱重載)

```sh
npm run dev
```

### 型別檢查、建置與壓縮(正式版)

```sh
npm run build
```

### 以 ESLint 檢查

```sh
npm run lint
```

### 格式化

```sh
npm run format
```

---

## 注意事項

- **權限**:上傳 / 編輯後台目前沒有任何身分驗證,任何能連到 dev server 的人都能改內容。僅適合本機自用,**請勿原樣部署到公開網路**。
- **資料位置**:內容寫死在 `src/content/`,適合開發環境。若要正式上線,建議將 md 檔移到不受建置影響的目錄,或改用資料庫 / 物件儲存。
- 直接用瀏覽器開後端 `localhost:3001` 時,Chrome DevTools 會探測一個 `.well-known/...devtools.json`;後端已回 204 消除該紅字,屬正常現象,不影響功能。

---

## 推薦的開發環境

### IDE

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 擴充套件(並停用 Vetur)。

### 瀏覽器

- Chromium 系(Chrome / Edge / Brave 等):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [開啟 Chrome DevTools 的 Custom Object Formatter](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [開啟 Firefox DevTools 的 Custom Object Formatter](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

### `.vue` 在 TS 中的型別支援

TypeScript 預設無法處理 `.vue` 匯入的型別,因此本專案以 `vue-tsc` 取代 `tsc` 做型別檢查;編輯器端需安裝 [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 讓 TypeScript 語言服務認得 `.vue` 型別。

### 設定參考

詳見 [Vite 設定文件](https://vite.dev/config/)。
