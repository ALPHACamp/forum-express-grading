// 使用multer接取multipart/form-data
// 在這裡我們要接image
// https://www.npmjs.com/package/multer

const multer = require('multer')
const mime = require('mime-types') // 把mime type 轉成副檔名
// 更改存放名稱為 form名稱+流水號+檔名
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'temp/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + mime.extension(file.mimetype)) // 直接取得檔案的type
  }
})

const upload = multer({ storage })
module.exports = upload
