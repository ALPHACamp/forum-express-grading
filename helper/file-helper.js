const fs = require('fs') // fs為Node.js提供的模組

const localFileHandler = file => { // file 是 multer 處理完的檔案(會在controller內處裡)
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)

    // upload是之後拿來對外的資料夾名稱
    const fileName = `upload/${file.originalname}`
    // 將檔案複製一分到upload資料夾底下
    // `file.originalname`、`file.path`是multer的方法
    // fs開頭的是fs提供的方法
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}
module.exports = {
  localFileHandler
}
