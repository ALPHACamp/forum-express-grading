const fs = require('fs') // 引入 fs 模組
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const localFileHandler = file => {
  // file 是 multer 處理完的檔案，會在 controller 裡面處理。如果檔案不存在，直接結束這個函式，後面不會執行了。
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    // 保存原始檔案名稱，前面接上字串 upload，並存在 fileName 變數中，upload 就是到時候我們要拿來對外的資料夾名稱。
    const fileName = `upload/${file.originalname}`
    // 把檔案複製一份到 upload 資料夾底下。
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}
// 原本使用 fs 方法的地方，要改成用 imgur 提供的方法。
const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur.uploadFile(file.path)
      .then(img => {
        // ?. 是 JavaScript 專門處理物件用來處理物件的一款運算子 (operator)，名稱為 optional chaining。物件取值寫成 object?.key，JavaScript 會先去幫我們檢查符號前面這個 object 值存不存在。存在才往下取值 object.key，不存在就直接回傳 undefined
        resolve(img?.link || null) // 檢查 img 是否存在
      })
      .catch(err => reject(err))
  })
}
module.exports = {
  localFileHandler,
  imgurFileHandler
}
