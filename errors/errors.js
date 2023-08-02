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

class AdminCategoryError extends Error {
  constructor (message) {
    super(message)
    this.name = 'AdminCategoryError'
  }
}

module.exports = {
  RegisterError,
  AdminError,
  AdminCategoryError
}
