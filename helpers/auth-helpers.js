const getUser = req => {
  return req.user || null
}

exports = module.exports = {
  getUser
}
