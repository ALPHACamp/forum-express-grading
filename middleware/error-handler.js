module.exports = {
  generalErrorHandler (err, req, res, next) {
    // 判斷傳入的 err 是不是一個 Error 物件
    if (err instanceof Error) {
      // 是 => Error 物件裡面會有屬性 name 和 message
      req.flash('error_messages', err.message)
    } else {
      // 不是 => 可能傳的是錯誤報告，直接印出字串
      req.flash('error_messages', err)
    }
    if (req.originalUrl === '/signup') {
      req.flash('name', req.body.name)
      req.flash('email', req.body.email)
    }
    return res.redirect('back') // 把使用者導回錯誤發生的前一頁
    // 把 Error 物件傳給下一個error handler
    // 之後如果需要再細分錯誤的類型，例如：資料庫出錯、伺服器運作錯誤、網路連線失敗...等狀況，會需要用到
    // next(err)
  }
}
