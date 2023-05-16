const fs = require('fs') // 引入 fs 模組
const localFileHandler = file => {
  // file 是 multer 處理完的檔案，會在 controller 裡面處理。如果檔案不存在，直接結束這個函式，後面不會執行了。
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    // 保存原始檔案名稱，前面接上字串 upload，並存在 fileName 變數中，upload 就是到時候我們要拿來對外的資料夾名稱。
    const fileName = `upload/${file.originalname}`
    // 把檔案複製一份到 upload 資料夾底下。
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}
module.exports = {
  localFileHandler
}
