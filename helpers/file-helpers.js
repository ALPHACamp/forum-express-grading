const fs = require('fs')

module.exports = {
  localFileHandler: file => {
    return new Promise((resolve, reject) => {
      if (!file) return resolve(null)
      const fileName = `upload/${file.originalname}`
      fs.promises
        .readFile(file.path)
        .then(data => fs.promises.writeFile(fileName, data))
        .then(() => resolve(`/${fileName}`))
        .catch(err => reject(err))
    })
  }
}
