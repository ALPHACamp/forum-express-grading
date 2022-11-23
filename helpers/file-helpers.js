// fs 模組是 Node.js 提供專門來處理檔案的原生模組，因此不需要額外安裝
// file 開頭的，是 multer 提供的方法，例如 file.originalname
const fs = require('fs') // 引入 fs 模組
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const localFileHandler = file => {
  // file 是 multer 處理完的檔案
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const fileName = `upload/${file.originalname}`
    return fs.promises
      .readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}

const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur
      .uploadFile(file.path)
      .then(img => {
        // console.log(img);
        // {
        //   id: 'SjncV8X',
        //   deletehash: '4GltRF9OBHxWGY2',
        //   account_id: null,
        //   account_url: null,
        //   ad_type: null,
        //   ad_url: null,
        //   title: null,
        //   description: null,
        //   name: '',
        //   type: 'image/jpeg',
        //   width: 950,
        //   height: 722,
        //   size: 39616,
        //   views: 0,
        //   section: null,
        //   vote: null,
        //   bandwidth: 0,
        //   animated: false,
        //   favorite: false,
        //   in_gallery: false,
        //   in_most_viral: false,
        //   has_sound: false,
        //   is_ad: false,
        //   nsfw: null,
        //   link: 'https://i.imgur.com/SjncV8X.jpeg',
        //   tags: [],
        //   datetime: 1669184375,
        //   mp4: '',
        //   hls: ''
        // }
        resolve(img?.link || null) // 檢查 img 是否存在
        // 判斷多層則會例如 img? .link?.abc?.qwe?.()||null，有沒.link?沒的話有沒.abc?，以此類推
      })
      .catch(err => reject(err))
  })
}
module.exports = {
  localFileHandler,
  imgurFileHandler
}
