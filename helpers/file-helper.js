// 當milter儲存好放在temp中的檔案
// 把它複製到upper裡
// 然後回傳複製好的/+檔名
const fs = require('fs')
// 先申請Imgur Client ID後連線
// 沒有要callback 先不用放client Secret
// 使用版本imgur@1.0.2，不要用版本2.0

const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

// 改成async寫法
const localFileHandler = async file => {
  try {
    if (!file) return null
    const data = await fs.promises.readFile(file.path)

    // multer不能讀中文名稱
    // 因為busboy改設定，要加以下這一行
    // https://github.com/expressjs/multer/issues/1104
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
    const fileName = `upload/${file.originalname}`
    // https://nodejs.org/api/fs.html#fspromiseswritefilefile-data-options
    await fs.promises.writeFile(fileName, data)
    return `/${fileName}`
  } catch (err) {
    return err
  }
}

const imgurFileHandler = async file => {
  try {
    if (!file) return null
    const img = await imgur.uploadFile(file.path)
    return img?.link || null
  } catch (err) {
    return err
  }
}

module.exports = { localFileHandler, imgurFileHandler }
