const fs = require('fs') // 引入 fs 模組 file system
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

// 本地圖片
const localFileHandler = file => { // file 是 multer 處理完的檔案
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null) // 不存在就return 結束
    const fileName = `upload/${file.originalname}` // upload 對外的資料夾名稱
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}
// 線上圖片空間
const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur.uploadFile(file.path) // imgur.uploadFile imgur上傳語法
      .then(img => {
        resolve(img?.link || null) // 檢查 img 是否存在，存在執行 img.link(img API中的link) 不然就 null， ?. 檢查是否存在並執行下一步的js語法，可無限使用。
      })
      .catch(err => reject(err))
  })
}
module.exports = {
  localFileHandler,
  imgurFileHandler // 匯出
}
