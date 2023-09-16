const multer = require('multer')
const upload2Folder = multer({ dest: 'temp/' })
const upload2Memory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => file.mimetype.split('/')[0] === 'image' ? cb(null, true) : cb(new Error('Require one image file'))
})

module.exports = { upload2Folder, upload2Memory }
