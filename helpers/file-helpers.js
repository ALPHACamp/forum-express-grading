
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

const imgur = require('imgur')
imgur.setClientId(process.env.IMGUR_CLIENT_ID)

const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur.uploadFile(file.path)
      .then(img => {
        resolve(img?.link || null) // ?.可選串連運算子，檢查img是否存在
      })
      .catch(err => reject(err))
  })
}

module.exports = { localFileHandler, imgurFileHandler }
