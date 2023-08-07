const multer = require('multer')
const upload = multer({ dest: 'temp/' }) // 上傳的圖片會暫存到 temp 這個臨時資料夾中
module.exports = upload
