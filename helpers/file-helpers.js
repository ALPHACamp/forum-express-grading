const fs = require('fs')
<<<<<<< HEAD
const localFileHandler = (file) => {
=======
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

imgur.setClientId(IMGUR_CLIENT_ID)

const localFileHandler = file => {
>>>>>>> R01
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const fileName = `upload/${file.originalname}`
    return fs.promises
      .readFile(file.path)
<<<<<<< HEAD
      .then((data) => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch((err) => reject(err))
=======
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}

const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur.uploadFile(file.path)
      .then(img => resolve(img?.link || null))
      .catch(err => reject(err))
>>>>>>> R01
  })
}

module.exports = {
<<<<<<< HEAD
  localFileHandler
=======
  localFileHandler,
  imgurFileHandler
>>>>>>> R01
}
