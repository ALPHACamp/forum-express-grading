module.exports = {
  generalErrorHandler (err, req, res, next) {
    // 先判斷傳入的 err 是不是一個 Error 物件
    if (err instanceof Error) {
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_messages', `${err}`)
    }
    res.redirect('back') // 導回錯誤發生的前一頁
    next(err) // 把 Error 物件傳給下一個error handler
  }
}
