const fs = require('fs')

const localFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null) // file不存在 return
    const fileName = `upload/${file.originalname}` // 保存upload資料夾+原始檔名
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}
module.exports = {
  localFileHandler
}
