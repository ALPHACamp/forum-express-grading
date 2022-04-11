module.exports = {
  generalErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      req.flash('error_messages', `${err.name}: ${err.message}`) // err.name 預設是 error type
    } else {
      req.flash('error_messages', `${err}`)
    }
    res.redirect('back') // 丟回前一頁，因爲從前一頁來的，所以前一頁一定不會錯
    next(err)
  }
}
