// 引入 fs 模組
const fs = require('fs')
// imgur
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)
// file 是 multer 處理完的檔案
const localFileHandler = file => {
  return new Promise((resolve, reject) => {
    // 如果檔案不存在，直接結束這個函式
    if (!file) return resolve(null)
    // 保存原始檔案名稱
    const fileName = `upload/${file.originalname}`
    // 把檔案複製一份到 upload 資料夾底下
    return fs.promises
      .readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}
// 原本使用 fs 方法的地方，要改成用 imgur 提供的方法
const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur
      .uploadFile(file.path)
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
