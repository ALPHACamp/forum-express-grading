const getUser = req => {
  return req.user || null
}

const authUser = req => {
  if (req?.params?.id === undefined) throw new Error('Unable to access this profile')
  if (req?.user?.id === undefined) throw new Error('Unable to access this profile')
  if (Number(req.user.id) !== Number(req.params.id)) {
    throw new Error('Unable to access this profile')
  }
}

const ensureAuthenticated = req => {
  return req.isAuthenticated()
}

module.exports = {
  getUser,
  authUser,
  ensureAuthenticated
}
