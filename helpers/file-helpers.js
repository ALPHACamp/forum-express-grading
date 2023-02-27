const fs = require('fs')
const imgur = require('imgur')
// - file 代表 multer 處理完的檔案
const localFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const fileName = `upload/${file.originalname}` // -新檔案位置與名稱
    // -使用 fs promise 語法進行讀檔寫入進 upload 資料夾
    return fs.promises
      .readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}

const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur
      .uploadFile(file.path)
      .then(img => resolve(img?.link || null)) // -檢查 img 是否存在
      .catch(err => reject(err))
  })
}
module.exports = {
  localFileHandler,
  imgurFileHandler
}
