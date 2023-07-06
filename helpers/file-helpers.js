// 引入 fs 模組, fs 模組是 Node.js 提供專門來處理檔案的原生模組
const fs = require('fs')
// file 是 multer 處理完的檔案,確認該file存在複製一份到對外資料夾
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

module.exports = {
  localFileHandler
}
