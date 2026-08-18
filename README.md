# 排程管理系統

一個以 React 製作的個人排程管理介面，提供週排程統計、月曆瀏覽、排程編輯與自訂分類功能。排程資料以 Google Sheet 為唯一來源，分類設定保存在瀏覽器的 `localStorage`。

## 功能

- 以堆疊長條圖查看每週排程與分類時數
- 以月曆檢視每日排程及分類色彩
- 新增、編輯與刪除排程
- 依分類篩選排程
- 自訂分類名稱與顏色
- 使用富文字編輯器撰寫排程內容
- 從 Google Sheet 載入並同步新增、編輯與刪除

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

## Google Sheet 設定

目前使用的試算表：[排程 DATA](https://docs.google.com/spreadsheets/d/1EzKFvdVVi-spSxF2-8AnwuET1wl9IPZNOXmdu0dZfGo/edit)。公開 CSV 可直接讀取；新增、編輯與刪除需要部署 Apps Script Web App：

1. 在試算表選擇「擴充功能 → Apps Script」。
2. 將 `google-apps-script/Code.gs` 貼入編輯器並儲存。
3. 選擇「部署 → 新增部署作業 → 網頁應用程式」。
4. 執行身分選擇自己，存取權選擇「所有人」，完成授權並部署。
5. 複製 Web App URL，建立 `.env.local`：

```env
VITE_GOOGLE_SHEETS_API_URL="https://script.google.com/macros/s/DEPLOYMENT_ID/exec"
```

Apps Script 首次讀取時會在原工作表後方補上 `ID` 與 `建立時間` 欄位，供同步辨識使用。分類設定仍儲存在目前瀏覽器的 `localStorage`。

## 專案結構

```text
src/
├── components/       # 月曆、圖表、表單與分類管理元件
├── utils/            # 日期、Google Sheet 與 localStorage 存取
├── App.tsx           # 應用程式狀態與主要畫面
├── index.css         # 全域樣式
├── main.tsx          # React 入口
└── types.ts          # 共用型別
google-apps-script/   # Google Sheet 寫入 API
```
