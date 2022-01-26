// 引入fs模組
const fs = require('fs')

// 本地端存取圖片function
const localFileHandler = file => {
  return new Promise((resolve, reject) => {
    // 若沒有檔案，回傳null值
    if (!file) return resolve(null)

    // 若有檔案，先定義要複製檔案路徑
    const fileName = `upload/${file.originalname}`
    // 讀取來源檔案路徑
    return fs.promises.readFile(file.path)
      // 複製檔案至目地路徑
      .then(data => fs.promises.writeFile(fileName, data))
      // 回傳檔案所在地路徑
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}

// 匯出模組
module.exports = {
  localFileHandler
}
