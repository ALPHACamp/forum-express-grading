// 引入 fs 模組，處理檔案相關
const fs = require('fs')
// for imgur
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

// file 是 multer 處理完的檔案
const localFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const fileName = `upload/${file.originalname}`
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}
// for imgur to deal with online picture
const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur.uploadFile(file.path)
      .then(img => {
        console.log(img)
        resolve(img?.link || null) // 檢查 img 是否存在
      })
      .catch(err => reject(err))
  })
}
module.exports = {
  localFileHandler,
  imgurFileHandler
}
