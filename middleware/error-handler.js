
module.exports = {
  generalErrorHandler: (err, req, res, next) => {
    if (err instanceof Error) {
      console.log(`handler: ${err.name}: ${err.message}`)
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      console.log(`handler: ${err}`)
      req.flash('error_messages', `${err}`)
    }
    res.redirect('back') // 導回錯誤發生的前一頁
    next(err)
  }
}
