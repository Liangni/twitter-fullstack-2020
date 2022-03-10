# Simple Twitter
使用Express及Mysql 打造出來的一個簡單的社群網站。

### 前台畫面
![image](/public/images/Simple-Twitter-2.PNG)
### 後台畫面
![image](/public/images/Simple-Twitter-3.PNG)

## 產品功能
* 有屬於管理者的登入平台。
* 管理者可以瀏覽網站上所有的推文。
* 管理者可以刪除推文。
* 管理者可以在清單上瀏覽所有的使用者。
* 使用者必須登入才可以使用。
* 使用者可以註冊帳號。
* 使用者可以在設定頁面重新設定帳戶資訊。
* 使用者可以瀏覽自己的個人資料也可以瀏覽其他使用者的個人資料。
* 使用者可以編輯自己的個人資料。
* 使用者可以在首頁瀏覽社群網站所有使用者發佈的推文、喜歡數量及推文時間。
* 使用者可以在首頁輸入文字直接推文或點擊推文扭推文。
* 使用者可以點擊首頁推文進入個別推文查看回覆串。
* 使用者可以在個別推文頁面點擊回覆框留言。
* 使用者可以在個人資料查看自己所有發佈的推文、回覆過的留言及喜歡的內容。
* 使用者可以在個人資料頁面點擊追隨中、追隨者時會進入追隨頁面。
* 使用者可以在追隨頁面查看追隨狀況。
* 使用者可以追隨其他使用者。
* 使用者可以喜愛推文。
* 使用者可以在頁面右邊看到熱門的使用者。

## 專案網站
https://desolate-hollows-32648.herokuapp.com/

## 測試帳號
* 管理員帳號（後臺登入使用）: root, 密碼: 12345678
* 使用者帳號（前臺登入使用）: user1, 密碼: 12345678

## 本地專案安裝
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

4. 創建資料庫
```
create database ac_twitter_workspace;
```

5. 建立 migration
```
npx sequelize db:migrate
```

6. 建立 seeder
```
npx sequelize db:seed:all
```

7. 啟動伺服器執行檔案
```
npm run dev
```

8. 出現以下字樣表示啟動成功!
```
Example app listening on port 3000!
```

## 開發人員
本專案最初由Penny Pan（本儲存庫持有者）、[信](https://github.com/Sin0001)、[Zin](https://github.com/ZinXianY) 共同開發，並於2021年12月25號部署上線。初版專案儲存庫與網站連結如下：

* github儲存庫： [https://github.com/ZinXianY/twitter-fullstack-2020](https://github.com/ZinXianY/twitter-fullstack-2020)
* 網站連結：[https://cryptic-spire-71023.herokuapp.com](https://cryptic-spire-71023.herokuapp.com)

2021年12月25號後的版本，是由Penny Pan優化後推出，詳細版本變更請見本儲存庫commit紀錄。
