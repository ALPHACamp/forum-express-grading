module.exports = {
  generalErrorHandler (error, req, res, next) {
    if (error instanceof Error) { // 判斷是否為物件，如果是物件會有屬性 name、message
      req.flash('error_messages', `${error.name}: ${error.message}`)
    } else { // 不是物件表示可能只是一串字串
      req.flash('error_messages', `${error}`)
    }
    res.redirect('back') // 回上一頁
    next(error) // 將 error 傳給下一個 error handler ??為何? -> 因為 error 傳下去可以針對不同的錯誤進行更細目的判斷，作為伺服器運作錯誤的 log 或其他用途
  }
}
