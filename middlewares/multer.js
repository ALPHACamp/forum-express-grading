// 使用multer接取multipart/form-data
// 在這裡我們要接image
// https://www.npmjs.com/package/multer

const multer = require('multer')
const upload = multer({ dest: 'temp/' })
module.exports = upload
