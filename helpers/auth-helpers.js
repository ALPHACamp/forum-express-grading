const getUser = req => {
  return req.user || null
}

const ensureAuthenticated = req => {
  return req.isAuthenticated()
}

const isSuperUser = user => {
  // Super user list
  const superUser = ['root@example.com']

  return superUser.includes(user.email)
}

module.exports = { getUser, ensureAuthenticated, isSuperUser }
