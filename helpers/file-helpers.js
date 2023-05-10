const fs = require('fs')

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

// 從 temp 裡面讀取檔案，寫到 upload 裡面，回傳 upload 中檔案的 absolute path

// 目前開發階段先把資料存在本地伺服器 local，以後會在使用其他雲端來存資料
// file.originalName / file.path 都是 multer 提供的 method
// fileName 使用的是 relative path 所以前面不加上 "/"
// resolve('/${fileName}') 在前面加了一個 “/” 代表 absolute path
