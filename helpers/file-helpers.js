const fs = require('fs')

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

module.exports = {
  localFileHandler
}