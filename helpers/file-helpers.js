const fs = require('fs')

const localFileHandler = file => { // 這裡的file是multer處理完的檔案
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null) // 如果沒有這個檔案，直接結束此函式

    const fileName = `upload/${file.originalname}`
    return fs.promises.readFile(file.path) // 讀此檔案的路徑
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}

module.exports = { localFileHandler }
