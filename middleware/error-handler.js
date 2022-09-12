module.exports = {
  generalErrorHandler (err, req, res, next) {
    // 判斷傳入的err是不是一個Error物件
    if (err instanceof Error) {
      // 利用快閃訊息把值印出
      req.flash('error_messages', `${err.name}:${err.message}`)
    } else {
      // 直接印出錯誤報告
      req.flash('error_messages', `${err}`)
    }
    res.redirect('back') // 把使用者導回錯誤發生的前一頁
    next(err) // 把Error物件傳給下一個error handler
  }
}
