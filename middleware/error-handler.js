module.exports = {
  generalErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_messages', `${err}`)
    }
    res.redirect('back') // 回上一頁
    next(err) // 傳到下一個middleware 目前沒有功用，只是示範
  }
}
