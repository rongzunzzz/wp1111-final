# Web Programming 110-Final-Project Group 28
# 專題名稱：拯救你的期末考
## 簡介：
期末考期間有一大堆的考試、作業、報告，很多人都在前一兩天急急忙忙的熬夜趕作業唸書，常常會懊悔自己為什麼不早點開始。我們設計了一個可以記錄課程與課程相關事項的行事曆，可以在行事曆上快速加入課程的待辦事項，也可以統一看到所有的課程需要繳交的項目。

## Demo 影片連結：

## Deploy 連結：

## 安裝步驟：
1. 將資料夾 clone 下來之後，在此資料夾執行 yarn install
2. 分別進入 Frontend、Backend 資料夾執行 yarn install
3. 於後端新增一個 .env 檔案，存入自己的 mongoDB 連結（已經有存好的 .env.defaults）
3. 測試時在 Frontend 資料夾執行 yarn start，在 Backend 資料夾執行 yarn server。
4. 打開 localhost:3000 即可使用前端功能

## 登入帳號：
如果不測試註冊功能，可以使用以下帳號密碼登入：
帳號：
密碼：

## 功能說明：
此報告的說明比臉書會再詳細一些。
### 登入、註冊
1. 註冊帳號：沒有重複帳號後即可申請成功跳到登入頁，再執行登入。
2. 初次登入時，會需要設定你的 NickName、想要排程的開始日期與結束日期。
3. 設定完成後，每次重新登入都會是顯示已經存過的資料。
4. 登入後可按右上角 Log Out 按鍵登出。
### 選單切換
左邊的選單可以切換 Calendar 頁面、Course 頁面、Setting 頁面。
### 行事曆
於 Planner 頁面：
1. 新增行程：點按左上角 ADD 按鍵，輸入名稱、日期、時間、屬於特定課程的特定待辦事項（可以為非課程）、行程是否重複。
    備註：新增行程只能在 Planner 設定的範圍內新增。
2. 編輯行程：點按特定行程的鉛筆按鍵，修改行程內容（無法修改所屬的課程事項）。
3. 刪除行程：點按特定行程的垃圾桶按鍵，將行程刪除。
4. 點按行事曆左上角的 Last Week、Next Week，可以切換星期。
6. 左邊的 Deadline 會顯示這個星期還沒過的待辦事項。
### 新增課程與課程待辦事項
於 Course 頁面：
#### 課程
1. 新增課程：點按左下角的加號按鍵，新增新的課程。
2. 刪除課程：在課程格的右上角，點按刪除按鍵，將課程刪除。
#### 課程待辦事項
待辦事項有分為 Exam（大考：期中期末考）、Project（報告與專題）、HW（作業）、Quiz（小考）四種類型。並且可以設定待辦事項的截止日期 Due Date。
1. 新增待辦事項：在課程格的右上角，點按加號按鍵，可以新增待辦事項。
2. 待辦事項完成度：使用 Checkbox 確認是否完成。
3. 刪除待辦事項：特定待辦事項的右邊有垃圾桶按鍵，可以刪除待辦事項。
### 設定頁面
1. 修改名字
2. 修改 Planner 的日期範圍

## 使用的第三方框架、套件
#### Frontend
react, react-dom, react-router-dom, style-components, ant design, material-ui, axios, dayjs, moment
#### Backend
babel, cors, express, nodemon, mongoose, dotenv-defaults, moment 
#### Database
MongoDB

## 組員貢獻：
李承軒：
蔡宜蓁：
黃戎僔：