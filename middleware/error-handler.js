module.exports = {
  generalErrorHandler: async (err, req, res, next) => {
    try {
      if (err instanceof Error) {
        req.flash('error_messages', `${err.name}: ${err.message}`)
      } else {
        req.flash('error_messages', `${err}`)
      }
      return res.redirect('back')
    } catch (error) {
      return next(error)
    }
  }
}
