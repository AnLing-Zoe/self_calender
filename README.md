# 排程管理系統

一個以 React 製作的個人排程管理介面，提供週排程統計、月曆瀏覽、排程編輯與自訂分類功能。所有資料皆儲存在瀏覽器的 `localStorage`，不需要後端服務或資料庫。

## 功能

- 以堆疊長條圖查看每週排程與分類時數
- 以月曆檢視每日排程及分類色彩
- 新增、編輯與刪除排程
- 依分類篩選排程
- 自訂分類名稱與顏色
- 使用富文字編輯器撰寫排程內容
- 自動將資料保存在瀏覽器

## 技術棧

- React 19
- TypeScript 5
- Vite 6
- Tailwind CSS 4
- Lucide React

## 開始使用

環境需求：Node.js 18 以上版本與 npm。

```bash
npm install
npm run dev
```

開啟 <http://localhost:3000> 即可使用。

## 可用指令

```bash
npm run dev      # 啟動開發伺服器
npm run build    # 建立正式版本
npm run preview  # 預覽正式版本
npm run lint     # 執行 TypeScript 型別檢查
```

## 資料儲存

分類與排程資料儲存在目前瀏覽器的 `localStorage`。首次開啟時會建立預設分類與範例排程；清除網站資料後，已建立的內容也會一併移除。

本專案目前不需要設定環境變數。

## 專案結構

```text
src/
├── components/       # 月曆、圖表、表單與分類管理元件
├── utils/            # 日期處理與 localStorage 存取
├── App.tsx           # 應用程式狀態與主要畫面
├── index.css         # 全域樣式
├── main.tsx          # React 入口
└── types.ts          # 共用型別
```
