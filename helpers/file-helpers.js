const fs = require('fs')
const imgur = require('imgur')

const localFileHandler = (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!file) return resolve(null)
      const fileName = `upload/${file.originalname}`
      const data = await fs.promises.readFile(file.path)
      await fs.promises.writeFile(fileName, data)
      return resolve(`/${fileName}`)
    } catch (err) {
      return reject(err)
    }
  })
}

const imgurFileHandler = (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!file) return resolve(null)
      const img = await imgur.uploadFile(file.path)
      return resolve(img?.link || null)
    } catch (err) {
      return reject(err)
    }
  })
}

module.exports = {
  localFileHandler,
  imgurFileHandler
}