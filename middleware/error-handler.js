// 根據Express文件，自己撰寫錯誤處裡的middleware要有4個參數

module.exports = {
  generalErrorHandler (err, req, res, next) {
    // 若是Error物件，裡面會有name、message屬性
    if (err instanceof Error) {
      // 這邊的 err.name 傳出來是Error
      req.flash('error_messages', `${err.name} : ${err.message}`)
      // 若不是Error物件，則直接把錯誤訊息印出來
    } else {
      req.flash('error_messages', `${err}`)
    }
    // 導回上一頁
    res.redirect('back')
    // 把Error物件傳給下一個error handler
    next(err)
  }
}
