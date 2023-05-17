const fs = require('fs') // node.js 原生模組
const localFileHandler = file => { // file 是 multer 處理完的檔案
    return new Promise((resolve, reject) => { // 回傳Promise
        if (!file) return resolve(null) // 判斷file是否存在
        const fileName = `upload/${file.originalname}` // 存取原始檔名
        return fs.promises.readFile(file.path) // 讀檔案
            .then(data => fs.promises.writeFile(fileName, data)) // 寫檔案
            .then(() => resolve(`/${fileName}`)) // 讀取圖片的路徑
            .catch(err => reject(err))
    })
}
module.exports = {
    localFileHandler
}
