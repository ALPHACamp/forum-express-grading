// 這邊在做從 temp 檔案夾複製到另外一個檔案夾 upload，並沿用同一個檔案名稱，所以檔案名稱也要拉出來丟過去
const fs = require('fs')
const localFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)

    const filePath = `/upload/${file.originalname}` // 加上檔案名稱加工成一個新的路徑
    return fs.promises.readFile(file.path) // 讀取存放在 temp 檔案路徑的檔案(所以二進位檔案) //沒有 return 也沒有差為甚麼要 return??
      .then(data => {
        fs.promises.writeFile(filePath, data)
      }) // 讀到圖片檔案本人寫入'/upload/原檔案名稱'這個路徑
      .then(() => resolve(filePath)) // return 是一個 new promise 因為 resolve 所以是這邊的內容
      .catch(error => reject(error))
  })
}

module.exports = { localFileHandler }
