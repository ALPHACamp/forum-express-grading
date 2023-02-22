const { readFile, writeFile } = require('fs').promises // fs.promises.readFile 、fs.promises.writeFile，可查 Node.js 中的 File system 文件

module.exports = {
  localFileHandler: file => { // multer處理後，可用 req.file 得到一包obj
    return new Promise((resolve, reject) => {
      if (!file) return resolve(null) // 若檔案不存在，直接結束
      const { filename } = file
      return readFile(file.path) // 回傳buffers
        .then(data => writeFile(`upload/${filename}`, data)) // 讀取data(buffer)，把檔案複製一份到 upload 資料夾底下
        .then(() => resolve(`/upload/${filename}`)) // 回傳 -> /upload/${filename}，作為image存入資料庫的路徑名
        .catch(err => reject(err))
    })
  }
}
