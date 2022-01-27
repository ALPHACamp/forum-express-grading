const fs = require('fs')
// 傳入的 file 是 multer 處理完的檔案
const localFileHandler = file => {
  return new Promise((resolve, reject) => {
    // 如果檔案不存在，直接結束函式
    if (!file) return resolve(null)
    // 保存原始檔案名稱，前面接上字串 upload，並存在 fileName 變數中
    const fileName = `upload/${file.originalname}`
    return fs.promises.readFile(file.path)
      // 檔案複製一份到 upload 資料夾
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => console.log(err))
  })
}
module.exports = {
  localFileHandler
}
