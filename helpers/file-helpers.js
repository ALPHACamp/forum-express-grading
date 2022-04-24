const fs = require('fs') // 引入 fs 模組
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const localFileHandler = async file => {
  try {
    if (!file) return null
    const fileName = `upload/${file.originalname}`
    const data = await fs.promises.readFile(file.path)
    await fs.promises.writeFile(fileName, data)
    return `/${fileName}`
  } catch (err) {
    throw new Error(err)
  }
}

// const localFileHandler = file => {
//   // file 是 multer 處理完的檔案
//   return new Promise((resolve, reject) => {
//     if (!file) return resolve(null)
//     const fileName = `upload/${file.originalname}`
//     return fs.promises
//       .readFile(file.path)
//       .then(data => fs.promises.writeFile(fileName, data))
//       .then(() => resolve(`/${fileName}`))
//       .catch(err => reject(err))
//   })
// }
// const imgurFileHandler = file => {
//   return new Promise((resolve, reject) => {
//     if (!file) return resolve(null)
//     return imgur
//       .uploadFile(file.path)
//       .then(img => {
//         resolve(img?.link || null) // 檢查 img 是否存在
//       })
//       .catch(err => reject(err))
//   })
// }

const imgurFileHandler = async file => {
  try {
    if (!file) return null
    const img = await imgur.uploadFile(file.path)
    return img?.link || null
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  localFileHandler,
  imgurFileHandler
}
