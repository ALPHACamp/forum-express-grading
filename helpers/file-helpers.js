// 載入fs模組
const fs = require('fs')
// 定義本地端的檔案處理器，參數file會是由multer所提供的req.file
const localFileHandler = file => {
  return new Promise((resolve, reject) => {
    // 該檔案不存在
    if (!file) return resolve(null)
    // 該檔案存在
    const targetFilePath = `upload/${file.originalname}`
    // file.path: The full path to the uploaded file
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile(targetFilePath, data))
      .then(() => resolve(`/${targetFilePath}`))
      .catch(error => reject(error))
  })
}

exports = module.exports = { localFileHandler }
