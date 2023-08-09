const fs = require('fs') // 引入 fs 模組
const localFileHandler = file => { // file 是 multer 處理完的檔案
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const fileName = `upload/${file.originalname}`
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}
module.exports = {
  localFileHandler
}

// const fs = require('fs');

// const localFileHandler = async (file) => {
//   try {
//     if (!file) return null;

//     const fileName = `upload/${file.originalname}`;
//     const data = await fs.promises.readFile(file.path);
//     await fs.promises.writeFile(fileName, data);

//     return `/${fileName}`;
//   } catch (err) {
//     throw err;
//   }
// };

// module.exports = {
//   localFileHandler,
// };
