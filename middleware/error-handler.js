module.exports = {
  generalErrorHandler (err, req, res, next) {
    // err 是否為一個實例(物件)，若是，有屬性 name 和 message； 若否，err 可能是字串
    if (err instanceof Error) {
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_messages', `${err}`)
    }

    res.redirect('back') // 重新導向錯誤發生的前一頁
    next(err) // 可以把 Error 物件傳給下一個 error handler
  }
}
