const fs = require('fs')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const localFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null) // file不存在 return
    const fileName = `upload/${file.originalname}` // 保存upload資料夾+原始檔名
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
        resolve(img?.link || null) // img ? img.link || null 檢查img是否存在
      })
      .catch(err => reject(err))
  })
}
module.exports = {
  localFileHandler,
  imgurFileHandler
}
