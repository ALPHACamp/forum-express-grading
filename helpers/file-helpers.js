// 引入 fs 模組, fs 模組是 Node.js 提供專門來處理檔案的原生模組
const fs = require('fs')

const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

// file 是 multer 處理完的檔案,確認該file存在複製一份到對外資料夾
const localFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    // file.originalname 、 file.path ，可查 multer 文件
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
