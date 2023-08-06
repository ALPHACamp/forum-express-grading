const multer = require('multer')
// 上傳的圖片會暫存到 temp 資料夾中
const upload = multer({ dest: 'temp/' })

module.exports = upload
