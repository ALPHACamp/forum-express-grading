const multer = require('multer')
const maxSize = 10 * 1000 * 1000 * 1000
const upload = multer({ dest: 'temp/', limits: { fileSize: maxSize } })
exports = module.exports = upload
