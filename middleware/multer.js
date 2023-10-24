const multer = require('multer')
const upload = multer({ dest: 'temp/' })
// .gitignore 底下要寫： temp /
module.exports = upload
