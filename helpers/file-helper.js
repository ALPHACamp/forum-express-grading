const fs = require('fs/promises')

module.exports = {
  localFileHandler (file) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve(null)

      const fileName = `upload/${file.originalname}`
      return fs.readFile(file.path)
        .then(data => fs.writeFile(fileName, data))
        .then(() => resolve(`/${fileName}`))
        .catch(err => reject(err))
    })
  }
}
