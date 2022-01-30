// 載入fs模組
const fs = require('fs')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

// 定義本地端的檔案處理器，參數file會是由multer所提供的req.file
const localFileHandler = file => {
  return new Promise((resolve, reject) => {
    // 該檔案不存在
    if (!file) return resolve(null)
    // 該檔案存在
    const targetFilePath = `upload/${file.originalname}`
    // file.path: The full path to the uploaded file
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile(targetFilePath, data))
      .then(() => resolve(`/${targetFilePath}`))
      .catch(error => reject(error))
  })
}

const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)

    imgur.uploadFile(file.path)
      .then(img =>
        resolve(img?.link || null)
      )
      .catch(error => reject(error))
  })
}

exports = module.exports = { localFileHandler, imgurFileHandler }
