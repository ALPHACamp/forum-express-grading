// 專門處理檔案的 helper
// fs 是 File system 的縮寫
const fs = require('fs')

// file 是 multer 處理完的檔案
// 以下程式：要確認file存在，並且將它從temp那邊複製到專門對外的資料夾upload中，之後前端要拿檔案就會直接去upload
// localFileHandler：目前是在本地處理圖片，量多可能會有其他做法
const localFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null) // 如果檔案不存在，直接結束這個函式，後面不會執行了
    // file 開頭的，是 multer 提供的方法，例如 file.originalname
    const fileName = `upload/${file.originalname}` // upload 是之後要拿來對外的資料夾名稱
    return fs.promises.readFile(file.path) // 1. 讀出檔案的位置
      .then(data => fs.promises.writeFile(fileName, data)) // 2. 讀到後會拿到一包data（檔案），把檔案寫到fileName（路徑）
      // 以上三行：把剛剛存在temp的檔案，複製一份到upload（正式對外的資料夾）中
      .then(() => resolve(`/${fileName}`)) // Promise 結束並回傳到外面（加/，之後可以直接當讀取圖片的路徑）
      .catch(err => reject(err))
  })
}
module.exports = {
  localFileHandler
}
