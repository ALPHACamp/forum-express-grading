const fs = require('fs')
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
module.exports = {
  localFileHandler
}
