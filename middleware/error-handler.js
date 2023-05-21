module.exports = {
  generalErrorHandler (err, req, res, next) {
    if (err instanceof Error) { // 判斷傳入的 err 是不是一個 Error 物件
      req.flash('error_messages', `${err.name}: ${err.message}`) // 如果是，Error 物件裡面會有屬性 name 和 message，那麼就利用快閃訊息把值印出來給使用者看
    } else {
      req.flash('error_messages', `${err}`) // 如果不是 Error 物件，可能傳進來一堆錯誤報告，直接把字串印出來即可
    }
    res.redirect('back')
    next(err) // 把 Error 物件傳給下一個error handler
  }
}
