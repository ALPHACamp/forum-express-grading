class RegisterError extends Error {
  constructor (message) {
    super(message)
    this.name = 'RegisterError'
  }
}

class AdminError extends Error {
  constructor (message) {
    super(message)
    this.name = 'PostRestaurantError'
  }
}
module.exports = {
  RegisterError,
  AdminError
}
