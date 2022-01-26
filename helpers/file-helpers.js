// 引入fs模組
const fs = require('fs')

// 引入imgur模組
const imgur = require('imgur')
// 取出clintId變數
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
// imgur設定clientId
imgur.setClientId(IMGUR_CLIENT_ID)

// 本地端存取圖片function
const localFileHandler = file => {
  return new Promise((resolve, reject) => {
    // 若沒有檔案，回傳null值
    if (!file) return resolve(null)

    // 若有檔案，先定義要複製檔案路徑
    const fileName = `upload/${file.originalname}`
    // 讀取來源檔案路徑
    return fs.promises.readFile(file.path)
      // 複製檔案至目地路徑
      .then(data => fs.promises.writeFile(fileName, data))
      // 回傳檔案所在地路徑
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}

// 圖片上傳至第三方_imgur
const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    // 若沒有檔案，回傳null值
    if (!file) return resolve(null)

    // 若有檔案，上傳至imgur
    return imgur.uploadFile(file.path)
      .then(img => {
        // 若成功上傳，會回傳img物件，則回傳img.link，若無則回傳null
        resolve(img?.link || null)
      })
      .catch(err => reject(err))
  })
}

// 匯出模組
module.exports = {
  localFileHandler,
  imgurFileHandler
}
