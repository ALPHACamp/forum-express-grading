// 引入js 原生模組
const fs = require('fs')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

// file 是 multer 處理完的檔案
const localFileHandle = file => {
  return new Promise((resolve, reject) => {
    // 如果沒有資料就結束
    if (!file) return resolve(null)
    const fileName = `upload/${file.originalname}`
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}

const imgurFileHandle = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur.uploadFile(file.path)
      .then(img => {
        resolve(img?.link || null)
        console.log(img)
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  localFileHandle,
  imgurFileHandle
}
