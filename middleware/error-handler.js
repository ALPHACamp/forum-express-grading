module.exports = {
  generalErrorHandler (err, req, res, next) {
    // 先判斷err 是不是一個Error 物件
    if (err instanceof Error) { // 是, Error物件會有的屬性name, message 用快閃訊息印出來給使用者看
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else { // 否, 將Error 物件傳給下一個error handler
      req.flash('error_messages', `${err}`)
    }
    res.redirect('back')
    next(err)
  }
}
