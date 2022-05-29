const fs = require('fs')
const localFileHandler = file => { // multer處理過的檔案
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null) // 沒有檔案回傳null
    const fileName = `upload/${file.originalname}` // 檔案路徑指向upload/檔案名稱 upload試到時候要對外的資料夾
    return fs.promises.readFile(file.path) // 用fs從原始檔案路徑讀取檔案
      .then(data => fs.promises.writeFile(fileName, data)) // 把抓到的檔案複製一份到剛剛指向的路徑fileName
      .then(() => resolve(`/${fileName}`)) // 回傳新的檔案路徑
      .catch(err => reject(err))
  })
}
module.exports = {
  localFileHandler
}
