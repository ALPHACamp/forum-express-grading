
const fs = require('fs')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const localFileHandler = file => {
  console.log('here is file-helper line:5', file)
  // file 為multer處理好的檔案
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    // 定義圖片存放位置
    const fileName = `upload/${file.originalname}`
    // 從temp中取出圖片
    return fs.promises.readFile(file.path)
      .then(data => {
        console.log('here is file-helper line:14', data)
        // 將圖片放入upload
        fs.promises.writeFile(fileName, data)
          .then(() => resolve(`/${fileName}`))
      })
      .catch(err => reject(err))
  })
}

const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur.uploadFile(file.path)
      .then(img => {
        resolve(img?.link || null)
      }).catch(err => reject(err))
  })
}

module.exports = { localFileHandler, imgurFileHandler }
