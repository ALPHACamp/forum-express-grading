const fs = require('fs')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

imgur.setClientId(IMGUR_CLIENT_ID)

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

const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)

    return imgur.uploadFile(file.path)
      .then(img => {
        resolve(img?.link || null)
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  localFileHandler,
  imgurFileHandler
}

// 從 temp 裡面讀取檔案，寫到 upload 裡面，回傳 upload 中檔案的 absolute path

// 目前開發階段先把資料存在本地伺服器 local，以後會在使用其他雲端來存資料
// file.originalName / file.path 都是 multer 提供的 method
// fileName 使用的是 relative path 所以前面不加上 "/"
// resolve('/${fileName}') 在前面加了一個 “/” 代表 absolute path
