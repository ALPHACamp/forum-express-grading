module.exports = {
  generalErrorHandler (err, req, res, next) {
    // 先判斷傳入的 err 是不是一個 Error 物件
    if (err instanceof Error) {
      // Error 物件裡面會有屬性 name 和 message
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      // 可能傳進來一堆錯誤報告，直接把字串印出來即可
      req.flash('error_messages', `${err}`)
    }
    res.redirect('back')
    // 把 Error 物件傳給下一個error handler

    next(err)
  }
}
