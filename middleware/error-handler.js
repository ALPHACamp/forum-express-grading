module.exports = {
  async generalErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      await req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      await req.flash('error_messages', `${err}`)
    }
    await res.redirect('back')
    await next(err)
  }
}
