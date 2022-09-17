exports.getUser = req => {
  return req.user || null
}

exports.ensureAuthenticated = req => {
  return req.isAuthenticated()
}
