const multer = require('multer')
// store the file data in temp directory and store the file info in req.file
const upload = multer({ dest: 'temp/' })

module.exports = upload
