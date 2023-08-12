# README

1. Fork
2. git clone

## 初始化
### Initialize
```
git remote add upstream https://github.com/ALPHACamp/forum-express-grading.git  # 建立上游連線
npm install
```

### 設定資料庫
需要與 config/config.json 一致

```
create database forum;
```

### 執行測試
```
npm run test
```

## 下載作業規格
以 R01 為例

```
git checkout -b R01           # 開新分支
git merge origin/R01-test     # 下載作業規格
npm run test                  # 直到綠燈全亮

git add .
git commit -m "...."
```

## 繳交作業

```
git push origin R01           # 上傳本地進度
```

接著改成到 GitHub 來發 PR。

## 共用帳號
請一律設定下面 2 組帳號以利驗收：
* 第一組帳號有 admin 權限：
  * email: root@example.com
  * password: 12345678
* 第二組帳號沒有 admin 權限：
  * email: user1@example.com
  * password: 12345678

  /*mysql://
b33ae525e75ed0:
4c187a90@
us-cdbr-east-06.cleardb.net/
heroku_83a3f4a761b9ede?
reconnect=true*/

heroku config:set MYSQL_DATABASE_URL=mysql://user-87:AVNS_tE1lzLFDd8YRelZ5vHx@db-mysql-sgp1-69937-do-user-95578-0.b.db.ondigitalocean.com:25060/db-87?ssl-mode=REQUIRED