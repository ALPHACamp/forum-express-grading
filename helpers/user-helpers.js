const isSuperUser = user => {
  if (user.email === 'root@example.com') {
    user.superuser = true
  }
  return user
}

module.exports = {
  isSuperUser
}