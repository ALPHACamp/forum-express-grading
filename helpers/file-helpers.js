const fs = require('fs') // 引入 fs 模組
const localFileHandler = file => {
  // file 是 multer 處理完的檔案(在 controller 裡面處理)
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null) // 如果檔案不存在，直接結束這個函式，後面不會執行了
    const fileName = `upload/${file.originalname}` // 保存原始檔案名稱，upload 就是到時候我們要拿來對外的資料夾名稱(路徑)

    // 以下程式碼主要為將檔案複製一份到 upload 資料夾底下
    return (
      fs.promises
        .readFile(file.path) // 使用fs.promises.readFile函式來讀取 file.path

      // 01、如果成功讀取時，該函式返回一個 resolve 的 Promise，其值為文件的內容
      // 02、如果出現錯誤，它會返回一個 reject 的 Promise。

        .then(data => fs.promises.writeFile(fileName, data))
        // 使用 fs.promises.writeFile 函式將 data 寫入到 fileName 指定的新檔案
        // 簡單來說就是在 fileName 指定的位置建立一個檔案，並將 data 作為其內容

      // 相同的 :
      // 01、如果成功讀取時，該函式返回一個 resolve 的 Promise
      // 02、如果出現錯誤，它會返回一個 reject 的 Promise。

        .then(() => resolve(`/${fileName}`)) // 直接 resolve 一個包含 /${fileName} 字串的 Promise

        .catch(err => reject(err))
    )
  })
}
module.exports = {
  localFileHandler
}
