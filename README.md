# Simple Twitter
使用**Node.js**、**Express.js**及**Mysql**打造出來的社群網站。
體驗部署在**Heroku**的網站服務，請至https://desolate-hollows-32648.herokuapp.com/

![image](/public/images/tweets.PNG)

## 產品功能
網站角色分成**使用者**和**管理者**，分別能執行以下操作：

### 使用者
* **註冊:** 在前台自行註冊帳號
* **登入:** 在前台登入後使用網站服務
* **修改帳戶資訊:** 在設定頁面重新設定帳戶資訊
* **瀏覽所有使用者推文:** 在首頁瀏覽社群網站所有使用者發佈的推文、喜歡數量及推文時間
* **瀏覽個別推文與回覆:** 點擊首頁推文進入個別推文查看回覆串
* **新增推文:** 在首頁輸入文字直接推文或點擊左側推文按扭新增推文
* **喜歡推文:** 對喜愛的推文按「喜歡」
* **回覆推文:** 針對個別推文新增回覆
* **瀏覽熱門的使用者:** 可以在頁面右側看到追隨者數最多的前十名使用者
* **追隨其他使用者:** 可以追隨其他使用者，並收藏在個人資料頁面的正在追隨清單
* **瀏覽個人資料:** 在個人資料頁面查看個人簡介、自己所有發佈的推文、回覆過的留言及喜歡的內容；也可以查看正在追隨的使用者和自己的追隨者
* **編輯自我介紹:** 在個人資料頁面點擊「編輯個人資料」按鈕以上傳封面圖片、頭像、名稱、自我介紹
* **瀏覽他人資料:** 點擊他人的頭像就能瀏覽他人資料

### 管理者
* **登入:** 在後台登入後使用管理服務（管理者帳號無法在網站自行註冊，僅能從後端建置）
* **瀏覽全站推文:** 瀏覽網站上所有的推文
* **刪除全站推文:** 可以刪除網站推文
* **瀏覽使用者統計:** 瀏覽所有的使用者的統計資料，包含發表的推文數量、喜歡過的推文數量、跟隨與被跟隨數量

## 測試帳號
* 使用者帳號（前臺登入使用）: user1, 密碼: 12345678
* 管理員帳號（後臺登入使用）: root, 密碼: 12345678

## 專案安裝
1. 下載專案
```
git clone https://github.com/Liangni/twitter-fullstack-2020.git
```

2. 切換存放此專案資料夾
```
cd twitter-fullstack-2020
```

3. 安裝npm套件
```
npm install
```

4. 建立.env 檔，並參考.env.example輸入環境變數
```
touch .env
```

5. 創建資料庫
```
create database ac_twitter_workspace;
```

6. 建立 migration
```
npx sequelize db:migrate
```

7. 建立 seeder
```
npx sequelize db:seed:all
```

8. 啟動伺服器執行檔案
```
npm run dev
```

9. 出現以下字樣表示啟動成功!
```
Example app listening on port 3000!
```

## 開發人員
本專案最初由Penny Pan（本儲存庫持有者）、[信](https://github.com/Sin0001)、[Zin](https://github.com/ZinXianY) 共同開發，並於2021年12月25號部署上線。初版專案與網站連結如下：

* github儲存庫： [https://github.com/ZinXianY/twitter-fullstack-2020](https://github.com/ZinXianY/twitter-fullstack-2020)
* 網站連結：[https://cryptic-spire-71023.herokuapp.com](https://cryptic-spire-71023.herokuapp.com)

2021年12月25號後的版本是由Penny Pan優化後推出，詳細版本變更請見本儲存庫commit紀錄。
