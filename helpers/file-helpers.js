// Thinking 本地端開發，所以使用localFileHandler，放此未來若擴充至外部管理的話可以修正
const fs = require('fs'); // JS的原生file system

// Invoke the imgur
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

// notice 本地端開發的檔案處理，可以使用此段
// note 此處的file是經過multer處理完後的檔案
const localFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);

    // note 此upload是要對外開放的資料夾，file.originalname為multer的語法
    const fileName = `upload/${file.originalname}`;

    // note  以下為Node.js的 fs 操作語法 https://nodejs.org/api/fs.html#fspromiseswritefilefile-data-options
    // Thinking 讀取檔案的path後，接上upload字串存在fileName, 在回傳至/{fileName}形成一個新的path
    return fs.promises
      .readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err));
  });
};

// notice 當部署到外部server的時候，需要透過第三方套件來解決檔案儲存的問題時，就需要再做一個file-helper來處理相關檔案，如圖片使用imgur
const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)

    return imgur.uploadFile(file.path)
      .then(img => {
        // note 下面可以等於img && img.link 或是三元運算子imh ? img.link || null ，可以看一下ＭＤＮ
        resolve(img?.link || null) // check if img exist
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  localFileHandler,
  imgurFileHandler
};
