class SetRootRoleError extends Error {
  constructor(message) {
    super(message)
    this.name = SetRootRoleError
  }
}

class EditUserProfileError extends Error {
  constructor(message) {
    super(message)
    this.name = EditUserProfileError
  }
}

module.exports = {
  SetRootRoleError,
  EditUserProfileError
}
