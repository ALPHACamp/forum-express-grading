const fs = require('fs')
const fsPromoises = fs.promises

const localFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)

    const fileName = `upload/${file.originalname}`
    return fsPromoises.readFile(file.path)
      .then(data => fsPromoises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}

module.exports = {
  localFileHandler
}
