const fs = require('fs')
const imgur = require('imgur')
const { IMGUR_CLIENT_ID } = process.env
imgur.setClientId(IMGUR_CLIENT_ID)

const localFieldHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const filename = `upload/${file.originalname}`
    return fs.promises
      .readFile(file.path)
      .then(data => fs.promises.writeFile(filename, data))
      .then(() => resolve(`/${filename}`))
      .catch(err => reject(err))
  })
}

const imgurFieldHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur
      .uploadFile(file.path)
      .then(img => resolve(img?.link || null))
      .catch(err => reject(err))
  })
}

module.exports = {
  localFieldHandler,
  imgurFieldHandler
}
