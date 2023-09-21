const fs = require('fs')
const localFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const filePath = `upload/${file.originalname}`
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile(filePath, data))
      .then(() => resolve(`/${filePath}`))
      .catch(err => reject(err))
  })
}

module.exports = { localFileHandler }
