module.exports = {
  generalErrorHandler (err, req, res, next) { // 錯誤處理的 middleware 必須要有四個參數
    if (err instanceof Error) { // 首先判斷傳入的 err 是不是一個 Error 物件
      req.flash('error_messages', `${err.name}: ${err.message}`) // 如果是，Error 物件裡面會有屬性 name 和 message，那麼我們利用快閃訊息把值印出來給使用者看
    } else {
      req.flash('error_messages', `${err}`) // 如果不是 Error 物件，可能傳進來的一堆錯誤報告，直接把字串印出來即可
    }
    res.redirect('back')
    next(err) // 把 Error 物件傳給下一個error handler。在更正規的開發程序中，會再細分錯誤的類型 Error Handler，所以 err 傳下去可以做為伺服器運作錯誤的 log，或是其他用途。
  }
}
