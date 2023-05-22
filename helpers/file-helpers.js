const fs = require('fs') // 引入 fs 模組 file system
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
module.exports = {
  localFileHandler
}
