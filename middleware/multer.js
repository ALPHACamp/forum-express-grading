// modules
const multer = require('multer')

// upload images to temp
const upload = multer({ dest: 'temp/' })

// exports
module.exports = upload
