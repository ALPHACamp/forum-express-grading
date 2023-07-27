class RegisterError extends Error {
  constructor (message) {
    super(message)
    this.name = 'RegisterError'
  }
}

class AdminError extends Error {
  constructor (message) {
    super(message)
    this.name = 'AdminError'
  }
}
module.exports = {
  RegisterError,
  AdminError
}
