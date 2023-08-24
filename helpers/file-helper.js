const fs = require('fs') // 引入 fs 模組
const path = require('path')
const defaultAvatarPath = path.join(__dirname, 'upload/avatar01')

const localFileHandler = file => { // file 是 multer 處理完的檔案
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null) // 如果沒檔案整組回傳null
    const fileName = `upload/${file.originalname}` // 把檔名加上路徑作為正式的檔案位置
    return fs.promises.readFile(file.path) // 用fs讀取暫存資料夾中的檔案 傳給data
      .then(data => fs.promises.writeFile(fileName, data)) // 讀到的data用fs寫在正式的檔案位置複製一份
      .then(() => {
        resolve(`/${fileName}`)
      }) // 成功的話回傳檔案路徑+檔案名稱 一路往上傳回localFileHandler
      .catch(err => { reject(err) })
  })
}
module.exports = {
  localFileHandler,
  defaultAvatarPath
}
