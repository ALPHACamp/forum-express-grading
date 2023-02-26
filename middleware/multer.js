const multer = require('multer')
// -使用multer將圖片封包儲存到temp資料夾
const upload = multer({ dest: 'temp/' })
module.exports = upload
