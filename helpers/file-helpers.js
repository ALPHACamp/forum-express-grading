const fs = require('fs') // node.js原生模組 file system
const localFileHandler = file => {
  // file 是 multer 處理完的檔案
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const fileName = `upload/${file.originalname}` // 保留原始檔案name
    return fs.promises
      .readFile(file.path)
      // 複製一份檔案到upload資料夾中
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}
module.exports = {
  localFileHandler
}
