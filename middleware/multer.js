const multer = require('multer')
const upload = multer({ dest: 'temp/' }) // 未完成的檔案暫存temp資料夾
module.exports = upload
