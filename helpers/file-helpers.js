// 這支檔案會用到 fs 模組。fs 模組是 Node.js 提供專門來處理檔案的原生模組，因此你不需要額外安裝，即可引入使用。
// fs 是 File system 的縮寫，以下的邏輯主要是從官方文件說明中，查找到取出檔案的方法，再組合而成

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
