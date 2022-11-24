const multer = require('multer')

// 設定使用者上傳的圖片暫存到 temp 中。
const upload = multer({ dest: 'temp/' })

module.exports = upload
