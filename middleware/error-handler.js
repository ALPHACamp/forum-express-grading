module.exports = {
  generalErrorHandler (err, req, res, next) {
    // 判斷傳入的 err 是不是一個 Error 物件
    if (err instanceof Error) {
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      // 如果不是，直接把字串印出來
      req.flash('error_messages', `${err}`)
    }
    // 把使用者導回錯誤發生的前一頁
    res.redirect('back')
    // 把 Error 物件傳給下一個error handler
    next(err)
  }
}
