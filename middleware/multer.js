const multer = require('multer') // 載入multer
// const upload = multer({ dest: 'temp/' }) // 定義上傳圖片的目的地(簡單版)
const generateNums = () => `${Math.floor(Math.random() * 10000) + 1}`.padStart(5, '0')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'temp/')
  },
  filename: (req, file, cb) => {
    const fileType = file.mimetype.split('/')[1]
    const fileName = `${file.fieldname}-${Date.now()}-${generateNums()}.${fileType}`
    cb(null, fileName)
  }
})

const uploadLocal = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileType = file.mimetype.split('/')[1]
    return (!fileType.match(/jpeg|png|jpg/)) ? cb(new Error('只能上傳jpg或是png檔')) : cb(null, true)
  }
}).single('image')

const uploadImgur = multer({
  dest: 'temp/',
  fileFilter: (req, file, cb) => {
    const fileType = file.mimetype.split('/')[1]
    return (!fileType.match(/jpeg|png|jpg/)) ? cb(new Error('只能上傳jpg或是png檔')) : cb(null, true)
  }
}).single('image')

const uploadImage = (req, res, next) => {
  (process.env.NODE_ENV !== 'production')
    ? uploadLocal(req, res, err => (err) ? next(err) : next())
    : uploadImgur(req, res, err => (err) ? next(err) : next())
}

module.exports = uploadImage
