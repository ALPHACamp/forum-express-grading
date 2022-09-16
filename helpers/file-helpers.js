const fs = require('fs')

exports.localFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const fileName = `upload/${file.originalName}`
    return fs.promises.readFile(file.path)
    .then(data => fs.promises.writeFile(fileName, data))
    .then(() => resolve(`/${fileName}`))
    .catch(err => reject(err))
  })
}
