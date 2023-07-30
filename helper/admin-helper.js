const isRootAdminBeenRemove = (targetUser, rootEmail) => {
  return (targetUser.email === rootEmail)
}

module.exports = {
  isRootAdminBeenRemove
}
