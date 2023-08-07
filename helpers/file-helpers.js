const fs = require('fs') // 引入 fs 模組
const localFileHandler = file => { // file 是 multer 處理完的檔案
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

// file 開頭的，是 multer 提供的方法
// fs 開頭的，是 fs 提供的方法 = fs 模組是 Node.js 提供專門來處理檔案的原生模組
