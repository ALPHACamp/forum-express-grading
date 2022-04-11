// 本地端處理沒問題！但是到 Heroku 后要換成 imgur 因爲 heroku 上沒有 upload folder 而且 heroku 會不定時清楚文件夾，因爲沒付費
const fs = require('fs') // 引入 fs 模組 nodejs 的 file system

const localFileHandler = file => {
  // file 是 multer 處理完的檔案
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const fileName = `upload/${file.originalname}`
    return fs.promises
      .readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}

// 部署在 heroku 需要靠 imgur 來協助儲存 upload 檔案
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur
      .uploadFile(file.path)
      .then(img => {
        resolve(img?.link || null) // 完全等同於 resolve(img => img ? img.link || null)
      })
      .catch(err => reject(err))
  })
}

// return promise 處理完的東西，出去可以往下可直接接 then
module.exports = {
  localFileHandler,
  imgurFileHandler
}
