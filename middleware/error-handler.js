module.exports = {
  generalErrorHandler (err, req, res, next) {
    // 首先判斷傳入的 err 是不是一個 Error 物件
    if (err instanceof Error) {
      // 如果是，Error 物件裡面會有屬性 name 和 message，那就利用快閃訊息把值印出來給使用者看
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      // 如果不是 Error 物件，可能傳進來一堆錯誤報告，直接把字串印出來即可
      req.flash('error_messages', `${err}`)
    }
    // 把使用者導回錯誤發生的前一頁
    res.redirect('back')
    next(err)
  }
}
