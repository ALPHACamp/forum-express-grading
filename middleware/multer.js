const mutler = require('multer')
const upload = mutler({ dest: 'temp/' })
module.exports = upload
