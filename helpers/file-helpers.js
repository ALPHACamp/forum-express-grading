// 引入js 原生模組
const fs = require('fs')
// file 是 multer 處理完的檔案
const localFileHandle = file => {
  return new Promise((resolve, reject) => {
    // 如果沒有資料就結束
    if (!file) return resolve(null)
    const fileName = `upload/${file.originalname}`
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}

module.exports = {
  localFileHandle
}
