const multer = require('multer')
const upload = multer({ dest: 'trmp/' })
module.exports = upload
