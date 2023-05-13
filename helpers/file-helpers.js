const fs = require('fs')

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

module.exports = {
  localFieldHandler
}
