// fs 模組是 Node.js 提供專門來處理檔案的原生模組
const fs = require('fs')

const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

// 圖片儲存在伺服器使用
const localFileHandler = file => { // file 是 multer 處理完的檔案
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)

    const fileName = `upload/${file.originalname}` // 完整圖片儲存在 upload 資料夾的路徑
    return fs.promises.readFile(file.path) // 讀取在 temp 資料夾中的圖片
      .then(data => fs.promises.writeFile(fileName, data)) // 將圖片複製(寫入)到 upload 資料夾中
      .then(() => resolve(`/${fileName}`)) // 回傳完整圖片的路徑
      .catch(err => reject(err))
  })
}

// 圖片儲存在 imgur 使用
const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)

    return imgur.uploadFile(file.path)
      .then(img => {
        resolve(img?.link || null) // 等同 resolve((img ? img.link || undefined) || null)，檢查 img 是否存在
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  localFileHandler,
  imgurFileHandler
}
