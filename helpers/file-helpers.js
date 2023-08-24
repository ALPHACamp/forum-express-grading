// 處理圖片的方法：localFileHandler、imgurFileHandler

const fs = require('fs') // 引入 fs 模組
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const localFileHandler = file => { // file 是 multer 處理完的檔案
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const fileName = `upload/${file.originalname}`
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}

const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur.uploadFile(file.path)
      .then(img => {
        resolve(img?.link || null) // 檢查 img 是否存在 // 寫成 object?.key，JavaScript 會先去幫我們檢查符號前面這個 object 值存不存在。存在才往下取值 object.key，不存在就直接回傳 undefined
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  localFileHandler,
  imgurFileHandler
}

// file 開頭的，是 multer 提供的方法
// fs 開頭的，是 fs 提供的方法 = fs 模組是 Node.js 提供專門來處理檔案的原生模組。fs處理本地資料
