const getUser = req => {
  return req.user || null // req.user ? req.user : null
}

module.exports = {
  getUser
}
