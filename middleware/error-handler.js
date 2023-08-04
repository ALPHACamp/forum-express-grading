module.exports = {
  // 必須要有四個參數 (err, req, res, next)
  generalErrorHandler(err, req, res, next) {
    // 判斷傳入的 err 是不是一個 Error 物件
    if (err instanceof Error) {
      // Error 物件裡面會有屬性 name 和 message
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      // 如果不是 Error 物件，可能傳進來一堆錯誤報告
      req.flash('error_messages', `${err}`)
    }
    res.redirect('back') // 把使用者導回錯誤發生的前一頁
    next(err)
  }
}
