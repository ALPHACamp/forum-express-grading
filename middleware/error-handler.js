// 撰寫一支函式來接 user-controller 拋出的 Error 物件
// Express 自己撰寫錯誤處理的 middleware 必須要有四個參數 (err, req, res, next)
module.exports = {
  generalErrorHandler (err, req, res, next) {
    // return console.log(req.body)
    // 判斷傳入的 err 是不是一個 Error 物件
    if (err instanceof Error) {
      // 是，Error 物件裡面會有屬性 name 和 message
      req.flash('error_msg', `${err.name}: ${err.message}`)
    } else {
      // 不是，可能傳的是錯誤報告，直接印出字串
      req.flash('error_msg', `${err}`)
    }
    res.redirect('back') // 把使用者導回錯誤發生的前一頁

    // 把 Error 物件傳給下一個error handler
    // 之後如果需要再細分錯誤的類型，例如：資料庫出錯、伺服器運作錯誤、網路連線失敗...等狀況，會需要用到
    next(err)
  }
}
