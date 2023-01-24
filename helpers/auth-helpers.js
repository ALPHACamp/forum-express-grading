const getUser = req => {
  console.log(req.user)
  return req.user || null
}
module.exports = {
  getUser
}
