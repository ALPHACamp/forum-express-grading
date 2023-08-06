// 引入 fs 模組
const fs = require('fs')
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
module.exports = {
  localFileHandler
}
